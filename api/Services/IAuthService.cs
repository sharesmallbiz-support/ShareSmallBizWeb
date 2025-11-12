using ShareSmallBiz.Api.Models;

namespace ShareSmallBiz.Api.Services;

public interface IAuthService
{
    Task<User?> AuthenticateAsync(string username, string password);
    Task<User> RegisterAsync(User user, string password);
    string GenerateToken(User user);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}
