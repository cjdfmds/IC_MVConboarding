using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MVC_with_React.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ThisProjectDbContextClass>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ThisProjectDbContext")));


//ADDED  FOR SWAGGER
builder.Services.AddSwaggerGen(options => { options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "ASP.NET CORE API", Version = "v1" }); });


var app = builder.Build();




// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}


//ADDED FOR THE LINKING BIT!!
app.UseCors(options=> { options.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true); });


//app.UseHttpsRedirection();
app.UseStaticFiles();


//NOTE TO GET TO SWAGGER FOR OUR BACKEND, ADD /swagger/index.html at the end of our local host number
//ADDED NEXT 2 LINES  FOR SWAGGER, 
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "React ASP.NET");
});


app.UseRouting();




app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
