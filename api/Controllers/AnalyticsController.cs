using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IStorageService _storage;

    public AnalyticsController(IStorageService storage)
    {
        _storage = storage;
    }

    // GET /api/analytics/users/{userId}
    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserAnalytics(string userId, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        var events = await _storage.GetUserAnalyticsAsync(userId, startDate, endDate);

        // Group by event type
        var grouped = events.GroupBy(e => e.EventType)
            .Select(g => new
            {
                eventType = g.Key,
                count = g.Count(),
                events = g.Select(e => new
                {
                    id = e.Id,
                    eventData = e.EventData != null ? System.Text.Json.JsonSerializer.Deserialize<object>(e.EventData) : null,
                    createdAt = e.CreatedAt
                })
            });

        return Ok(new
        {
            userId,
            startDate,
            endDate,
            summary = grouped,
            totalEvents = events.Count
        });
    }

    // POST /api/analytics/events
    [HttpPost("events")]
    public async Task<IActionResult> CreateEvent([FromBody] CreateAnalyticsEventRequest request)
    {
        var analyticsEvent = new AnalyticsEvent
        {
            UserId = request.UserId,
            EventType = request.EventType,
            EventData = request.EventData != null ? System.Text.Json.JsonSerializer.Serialize(request.EventData) : null
        };

        await _storage.CreateAnalyticsEventAsync(analyticsEvent);
        return Ok(new { message = "Event tracked successfully" });
    }
}

public class CreateAnalyticsEventRequest
{
    public string UserId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public object? EventData { get; set; }
}
