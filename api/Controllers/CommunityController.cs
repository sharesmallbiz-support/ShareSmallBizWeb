using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.Services;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api")]
public class CommunityController : ControllerBase
{
    private readonly IStorageService _storage;

    public CommunityController(IStorageService storage)
    {
        _storage = storage;
    }

    [HttpGet("trending")]
    public async Task<ActionResult<List<object>>> GetTrending()
    {
        var trending = await _storage.GetTrendingTopicsAsync();
        return Ok(trending);
    }
}
