using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.DTOs;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IStorageService _storage;

    public AuthController(IAuthService authService, IStorageService storage)
    {
        _authService = authService;
        _storage = storage;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _authService.AuthenticateAsync(request.Username, request.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = _authService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            User = MapToUserDto(user),
            Token = token
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
    {
        // Check if user already exists
        var existingUser = await _storage.GetUserByUsernameAsync(request.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        existingUser = await _storage.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            FullName = request.FullName,
            BusinessName = request.BusinessName,
            BusinessType = request.BusinessType
        };

        user = await _authService.RegisterAsync(user, request.Password);
        var token = _authService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            User = MapToUserDto(user),
            Token = token
        });
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
