

using CarsIntegration.Models;
using CarsIntegration.Repository.Interfaces;
using CarsIntegration.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CarsIntegration.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepo;

        public LoginController(IConfiguration configuration, IUserRepository userRepo)
        {
            _configuration = configuration;
            _userRepo = userRepo;
        }

        private string GenerateToken(Users user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
              
                new Claim(ClaimTypes.Role, user.Role),
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddSeconds(1000),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /* [AllowAnonymous]
         [HttpPost]
         public IActionResult Login(Users credentials)
         {
             var user = _userRepo.GetUserByUsernameAndPassword(credentials.Username, credentials.Password);
             if (user != null)
             {
                 var token = GenerateToken(user);
                 return Ok(new { token });
             }

             return Unauthorized(); // Invalid credentials
         }*/

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(Users credentials)
        {
            var (userId, username, password,role) = _userRepo.GetUserByUsernameAndPassword(credentials.UserId,credentials.Username, credentials.Password,credentials.Role);
            if (userId != 0)
            {
                // Generate the token
                var token = GenerateToken(new Users { Username = username, Role = role ,Password=password});

                // Include the user ID in the response
                return Ok(new { token, userId,role,username });
            }

            return Unauthorized(); // Invalid credentials
        }



    }
}