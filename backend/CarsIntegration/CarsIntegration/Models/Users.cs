using System.ComponentModel.DataAnnotations;

namespace CarsIntegration.Models
{
    public class Users
    {

        [Key]
        public int UserId { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }
    }
}
