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
