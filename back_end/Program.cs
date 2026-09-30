using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();


builder.Services.AddCors( options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

app.UseCors("Frontend");

app.MapControllers();

app.MapGet("/api", () =>
{
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

