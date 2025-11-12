namespace ShareSmallBiz.Api.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
    public string? Location { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public string? Website { get; set; }
    public int Connections { get; set; }
    public int BusinessScore { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public UserDto User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
}
