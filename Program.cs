using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "DefaultConnection is missing."
    );
}

builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

app.MapControllers();

app.MapGet("/", () => {
    return "URL Shortener API is running";
});

app.MapGet("/health", () =>{
    return Results.Ok(
        new {
            Status = "Healthy"
        }
    );
});


app.MapGet("/db/health", async(AppDbContext dbContext) => {

    var canConnet = await dbContext.Database.CanConnectAsync();

    if(!canConnet)
    {
        return Results.Problem("Database connection failed.");
    }

    return Results.Ok(new {
        Database = "Connected"
    });

});

app.Run();


