using Microsoft.EntityFrameworkCore;
using UrlShortener.Models;

namespace UrlShortener.Data;

public class AppDbContext: DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Link> Links {get;set;} = null!;
}