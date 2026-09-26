using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;

namespace UrlShortener.Controllers;

[ApiController]
public class LinksController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public LinksController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("/")]
    public async Task<IActionResult> RedirectToDestination()
    {
        var subdomain = Request.Host.Host.Split(".")[0];

        var link = await _dbContext.Links.FirstOrDefaultAsync(
            link => link.Subdomain == subdomain
        );

        if (link is null)
        {
            return NotFound();
        }

        return Redirect(link.DestinationUrl);
    }
}