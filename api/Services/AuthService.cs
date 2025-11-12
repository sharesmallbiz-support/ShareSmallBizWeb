using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShareSmallBiz.Api.Models;

namespace ShareSmallBiz.Api.Services;

public class AuthService : IAuthService
{
    private readonly IStorageService _storage;
    private readonly IConfiguration _configuration;

    public AuthService(IStorageService storage, IConfiguration configuration)
    {
        _storage = storage;
        _configuration = configuration;
    }

    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        var user = await _storage.GetUserByUsernameAsync(username);
        if (user == null)
            return null;

        if (!VerifyPassword(password, user.Password))
            return null;

        return user;
    }

    public async Task<User> RegisterAsync(User user, string password)
    {
        user.Password = HashPassword(password);
        return await _storage.CreateUserAsync(user);
    }

    public string GenerateToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(jwtSettings["ExpirationMinutes"] ?? "1440")
            ),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
