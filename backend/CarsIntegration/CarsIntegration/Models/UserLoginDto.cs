namespace CarsIntegration.Models
{
    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class UserResponseDto
    {
        public string Username { get; set; }
        public string Role { get; set; }
    }
}