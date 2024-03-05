using CarsIntegration.Models;
using CarsIntegration.Repository.Interfaces;
using CarsIntegration.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace CarsIntegration.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepo;

        public SignupController(IConfiguration configuration, IUserRepository userRepo)
        {
            _configuration = configuration;
            _userRepo = userRepo;
        }

        private string GenerateToken(Users user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                null,
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Signup(Users credentials)
        {
            IActionResult response = BadRequest("Signup failed");

            // Check if the username is already taken
            var existingUser = _userRepo.GetUserByUsername(credentials.Username);
            if (existingUser != null)
            {
                return StatusCode(StatusCodes.Status409Conflict, "Username is already taken");
            }

            // Add the user to the repository
            var user = new Users
            {
                Username = credentials.Username,
                Password = credentials.Password,
                Role=credentials.Role,
            };
            _userRepo.AddUser(user);

            // Generate token for successful signup
            var token = GenerateToken(user);
            return Ok(new { token });
        }
    }
}