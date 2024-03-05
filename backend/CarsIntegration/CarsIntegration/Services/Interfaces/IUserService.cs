using CarsIntegration.Models;

namespace CarsIntegration.Services.Interfaces
{
    public interface IUserService
    {
        UserResponseDto Authenticate(string username, string password);
        
    }
}