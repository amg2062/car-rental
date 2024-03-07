using CarsIntegration.Models;
using CarsIntegration.Repository;
using System.Collections.Generic;

namespace CarsIntegration.Services.Interfaces
{
    public interface ICarsService
    {
        IEnumerable<Cars> GetCars(DateTime startDate, DateTime endDate);


        Reservation CreateReservation(Reservation reservation);
        Reservation GetReservationById(int id);

        IEnumerable<Reservation2> GetReservationsByUserIdWithCarDetails(int userId);

        void DeleteReservationAndUpdateCar(int reservationId);

        Cars InsertCar(Cars car);

        Reservation CreateBill(Bill bill);

        IEnumerable<Bill2> GetBillsByUserIdWithCarDetails(int userId);

        IEnumerable<Bill2> GetBillsWithCarDetails();
        Review InsertReview(Review review);
        IEnumerable<Review> GetReviewsByCarID(int carID);

        Image GetImageByCarID(int carID);
        void InsertImage(Image image);

    }
}