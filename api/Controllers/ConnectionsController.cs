using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConnectionsController : ControllerBase
{
    private readonly IStorageService _storage;

    public ConnectionsController(IStorageService storage)
    {
        _storage = storage;
    }

    // POST /api/connections - Send connection request
    [HttpPost]
    public async Task<IActionResult> CreateConnection([FromBody] CreateConnectionRequest request)
    {
        // Check if connection already exists
        if (await _storage.ConnectionExistsAsync(request.RequesterId, request.ReceiverId))
        {
            return BadRequest(new { message = "Connection request already exists" });
        }

        // Prevent self-connection
        if (request.RequesterId == request.ReceiverId)
        {
            return BadRequest(new { message = "Cannot connect to yourself" });
        }

        var connection = new Connection
        {
            RequesterId = request.RequesterId,
            ReceiverId = request.ReceiverId,
            Status = "pending"
        };

        var created = await _storage.CreateConnectionAsync(connection);

        // Create notification
        await _storage.CreateNotificationAsync(new Notification
        {
            UserId = request.ReceiverId,
            ActorId = request.RequesterId,
            Type = "connection",
            Message = "sent you a connection request",
            TargetId = created.Id,
            TargetType = "user"
        });

        return Ok(created);
    }

    // GET /api/connections/{id} - Get connection by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetConnection(string id)
    {
        var connection = await _storage.GetConnectionAsync(id);
        if (connection == null)
            return NotFound(new { message = "Connection not found" });

        return Ok(connection);
    }

    // PUT /api/connections/{id} - Accept/reject connection request
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateConnection(string id, [FromBody] UpdateConnectionRequest request)
    {
        try
        {
            var connection = await _storage.UpdateConnectionStatusAsync(id, request.Status);

            if (request.Status == "accepted")
            {
                // Create notification
                await _storage.CreateNotificationAsync(new Notification
                {
                    UserId = connection.RequesterId,
                    ActorId = connection.ReceiverId,
                    Type = "connection",
                    Message = "accepted your connection request",
                    TargetId = connection.Id,
                    TargetType = "user"
                });

                // Track analytics event
                await _storage.CreateAnalyticsEventAsync(new AnalyticsEvent
                {
                    UserId = connection.RequesterId,
                    EventType = "connection_made",
                    EventData = $"{{\"connectedUserId\":\"{connection.ReceiverId}\"}}"
                });

                await _storage.CreateAnalyticsEventAsync(new AnalyticsEvent
                {
                    UserId = connection.ReceiverId,
                    EventType = "connection_made",
                    EventData = $"{{\"connectedUserId\":\"{connection.RequesterId}\"}}"
                });
            }

            return Ok(connection);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // DELETE /api/connections/{id} - Remove connection
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConnection(string id)
    {
        var success = await _storage.DeleteConnectionAsync(id);
        if (!success)
            return NotFound(new { message = "Connection not found" });

        return NoContent();
    }
}

public class CreateConnectionRequest
{
    public string RequesterId { get; set; } = string.Empty;
    public string ReceiverId { get; set; } = string.Empty;
}

public class UpdateConnectionRequest
{
    public string Status { get; set; } = string.Empty; // accepted, rejected, blocked
}
