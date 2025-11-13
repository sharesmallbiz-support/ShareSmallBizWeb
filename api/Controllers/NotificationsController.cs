using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IStorageService _storage;

    public NotificationsController(IStorageService storage)
    {
        _storage = storage;
    }

    // GET /api/notifications?userId={userId}&unread={true/false}
    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] string userId, [FromQuery] bool? unread = null)
    {
        var notifications = await _storage.GetUserNotificationsAsync(userId, unread == true ? false : null);

        var result = notifications.Select(n => new
        {
            id = n.Id,
            type = n.Type,
            message = n.Message,
            read = n.Read,
            createdAt = n.CreatedAt,
            actor = new
            {
                id = n.Actor.Id,
                username = n.Actor.Username,
                fullName = n.Actor.FullName,
                avatar = n.Actor.Avatar
            },
            targetId = n.TargetId,
            targetType = n.TargetType
        });

        return Ok(new { notifications = result });
    }

    // PUT /api/notifications/{id}/read
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var success = await _storage.MarkNotificationAsReadAsync(id);
        if (!success)
            return NotFound(new { message = "Notification not found" });

        return Ok(new { message = "Notification marked as read" });
    }

    // GET /api/notifications/unread-count?userId={userId}
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount([FromQuery] string userId)
    {
        var count = await _storage.GetUnreadNotificationCountAsync(userId);
        return Ok(new { count });
    }
}
