using CarsIntegration.Models;

namespace CarsIntegration.Repositories
{
    public interface ILoginRepository
    {
        Users AuthenticateUser(string username, string password);
    }
}