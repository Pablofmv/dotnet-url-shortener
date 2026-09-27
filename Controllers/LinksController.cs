using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;
using UrlShortener.Models;

namespace UrlShortener.Controllers;

[ApiController]
public class LinksController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<LinksController> _logger;

    public LinksController(AppDbContext dbContext,
                            ILogger<LinksController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
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
            _logger.LogWarning(
                "Unkwnown subdomain {Subdomain}",
                subdomain
            );
            
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

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch(Exception exception)
        {
            _logger.LogError(
                exception,
                "Failed to record click for subdomain {Subdomain}",
                subdomain
            );

            throw;
        }

        _logger.LogInformation(
            "Redirecting subdomain {Subdomain} to {DestinationUrl}",
            subdomain,
            link.DestinationUrl
        );
        

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


    [HttpGet("/analytics/unique-visitors-last-5-days")]
    public async Task<IActionResult> GetUniqueVisitorsLast5days()
    {
        var today = DateTime.UtcNow.Date;

        var startDate = today.AddDays(-4);

        var uniqueVisitorsByDay = await _dbContext.ClickEvents
            .Where(click => click.ClickedAt >= startDate)
            .GroupBy(click => click.ClickedAt.Date)
            .Select(group => new {
                Day = group.Key,
                UniqueVisitors = group
                    .Select(click =>click.IpAddress)
                    .Distinct()
                    .Count()
            })
            .OrderBy(result => result.Day)
            .ToListAsync();
        
        return Ok(uniqueVisitorsByDay);
    }

}