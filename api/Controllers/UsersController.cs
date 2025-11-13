using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.DTOs;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IStorageService _storage;

    public UsersController(IStorageService storage)
    {
        _storage = storage;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var user = await _storage.GetUserAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(MapToUserDto(user));
    }

    [HttpGet("{id}/metrics")]
    public async Task<ActionResult<BusinessMetric>> GetMetrics(string id)
    {
        var metrics = await _storage.GetBusinessMetricsAsync(id);

        if (metrics == null)
        {
            // Create default metrics if none exist
            metrics = await _storage.UpdateBusinessMetricsAsync(id, new BusinessMetric
            {
                UserId = id,
                ProfileViews = 0,
                NetworkGrowth = 0,
                Opportunities = 0,
                EngagementScore = 0
            });
        }

        return Ok(metrics);
    }

    [HttpGet("{id}/suggestions")]
    public async Task<ActionResult<List<UserDto>>> GetSuggestions(
        string id,
        [FromQuery] int limit = 5)
    {
        var suggestions = await _storage.GetSuggestedConnectionsAsync(id, limit);
        return Ok(suggestions.Select(MapToUserDto).ToList());
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        var user = await _storage.GetUserAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update fields
        if (request.FullName != null) user.FullName = request.FullName;
        if (request.BusinessName != null) user.BusinessName = request.BusinessName;
        if (request.BusinessType != null) user.BusinessType = request.BusinessType;
        if (request.Location != null) user.Location = request.Location;
        if (request.Avatar != null) user.Avatar = request.Avatar;
        if (request.Bio != null) user.Bio = request.Bio;
        if (request.Website != null) user.Website = request.Website;

        var updated = await _storage.UpdateUserAsync(user);
        return Ok(MapToUserDto(updated));
    }

    [HttpGet("{id}/connections")]
    public async Task<ActionResult> GetConnections(string id, [FromQuery] string status = "accepted")
    {
        var connections = await _storage.GetUserConnectionsAsync(id, status);

        var result = connections.Select(c => new
        {
            id = c.Id,
            status = c.Status,
            createdAt = c.CreatedAt,
            user = MapToUserDto(c.RequesterId == id ? c.Receiver : c.Requester)
        });

        return Ok(new { connections = result });
    }

    [HttpGet("{id}/activities")]
    public async Task<ActionResult> GetActivities(string id, [FromQuery] int limit = 20)
    {
        var activities = await _storage.GetUserActivitiesAsync(id, limit);
        return Ok(new { activities });
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            BusinessName = user.BusinessName,
            BusinessType = user.BusinessType,
            Location = user.Location,
            Avatar = user.Avatar,
            Bio = user.Bio,
            Website = user.Website,
            Connections = user.Connections,
            BusinessScore = user.BusinessScore,
            CreatedAt = user.CreatedAt
        };
    }
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
    public string? Location { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public string? Website { get; set; }
}
