var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

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

app.Run();


