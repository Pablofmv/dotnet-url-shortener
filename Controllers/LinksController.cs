using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;
using UrlShortener.Models;

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

        var clickedAt = DateTime.UtcNow;

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";

        var referrer = Request.Headers["Referer"].ToString();

        var userAgent = Request.Headers["User-Agent"].ToString();

        var userAgentLower = userAgent.ToLower();

        var isBot = userAgentLower.Contains("bot") || userAgentLower.Contains("crawler") || userAgentLower.Contains("spider");

        var clickEvent = new ClickEvent
        {
            LinkId = link.Id,
            Subdomain = subdomain,
            ClickedAt = clickedAt,
            IpAddress = ipAddress,
            Referrer = referrer,
            UserAgent = userAgent,
            Country = "",
            Region = "",
            Organization = "",
            IsBot = isBot
        };

        _dbContext.ClickEvents.Add(clickEvent);

        await _dbContext.SaveChangesAsync();

        return Redirect(link.DestinationUrl);
    }


    [HttpGet("/analytics/unique-visitors")]
    public async Task<IActionResult> GetUniqueVisitors()
    {
        var uniqueVisitors = await _dbContext.ClickEvents
            .Select(click => click.IpAddress)
            .Distinct()
            .CountAsync();
        
        return Ok(new{
            UniqueVisitors = uniqueVisitors
        });
    }

    [HttpGet("/analytics/clicks-by-subdomain")]
    public async Task<IActionResult> GetClicksBySubdomain()
    {

        var clicksBySubdomain = await _dbContext.ClickEvents
            .GroupBy(click => click.Subdomain)
            .Select(group => new {
                Subdomain = group.Key,
                TotalClicks = group.Count()
            })
            .ToListAsync();
        
        return Ok(clicksBySubdomain);

    }
}