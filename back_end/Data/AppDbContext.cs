using Microsoft.EntityFrameworkCore;
using UrlShortener.Models;

namespace UrlShortener.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Link> Links { get; set; } = null!;

    public DbSet<ClickEvent> ClickEvents { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClickEvent>()
            .HasOne<Link>()
            .WithMany()
            .HasForeignKey(click => click.LinkId);
    }
}