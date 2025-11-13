using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/users/{userId}/settings")]
public class SettingsController : ControllerBase
{
    private readonly IStorageService _storage;

    public SettingsController(IStorageService storage)
    {
        _storage = storage;
    }

    // GET /api/users/{userId}/settings
    [HttpGet]
    public async Task<IActionResult> GetSettings(string userId)
    {
        var settings = await _storage.GetUserSettingsAsync(userId);

        if (settings == null)
        {
            // Return default settings if none exist
            return Ok(new
            {
                notifications = new
                {
                    emailNotifications = true,
                    pushNotifications = true,
                    commentNotifications = true,
                    likeNotifications = true,
                    connectionRequests = true,
                    weeklySummary = false
                },
                privacy = new
                {
                    profileVisibility = "public",
                    showEmail = false,
                    showLocation = true,
                    searchable = true,
                    showMetrics = true
                },
                business = new
                {
                    businessHours = "9:00 AM - 5:00 PM",
                    timezone = "America/Los_Angeles",
                    responseTime = "within 24 hours"
                },
                integrations = new
                {
                    facebook = new { connected = false, accountId = (string?)null, lastSync = (string?)null },
                    instagram = new { connected = false, accountId = (string?)null, lastSync = (string?)null },
                    linkedin = new { connected = false, accountId = (string?)null, lastSync = (string?)null }
                }
            });
        }

        return Ok(new
        {
            notifications = System.Text.Json.JsonSerializer.Deserialize<object>(settings.Notifications),
            privacy = System.Text.Json.JsonSerializer.Deserialize<object>(settings.Privacy),
            business = settings.Business != null ? System.Text.Json.JsonSerializer.Deserialize<object>(settings.Business) : null,
            integrations = settings.Integrations != null ? System.Text.Json.JsonSerializer.Deserialize<object>(settings.Integrations) : null
        });
    }

    // PUT /api/users/{userId}/settings
    [HttpPut]
    public async Task<IActionResult> UpdateSettings(string userId, [FromBody] UpdateSettingsRequest request)
    {
        var settings = new UserSettings
        {
            UserId = userId,
            Notifications = System.Text.Json.JsonSerializer.Serialize(request.Notifications),
            Privacy = System.Text.Json.JsonSerializer.Serialize(request.Privacy),
            Business = request.Business != null ? System.Text.Json.JsonSerializer.Serialize(request.Business) : null,
            Integrations = request.Integrations != null ? System.Text.Json.JsonSerializer.Serialize(request.Integrations) : null
        };

        var updated = await _storage.CreateOrUpdateUserSettingsAsync(settings);
        return Ok(new { message = "Settings updated successfully" });
    }
}

public class UpdateSettingsRequest
{
    public object Notifications { get; set; } = new { };
    public object Privacy { get; set; } = new { };
    public object? Business { get; set; }
    public object? Integrations { get; set; }
}
