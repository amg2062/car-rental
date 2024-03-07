using CarsIntegration.Models;
using CarsIntegration.Repository;
using CarsIntegration.Repository.Interfaces;
using CarsIntegration.Services.Interfaces;
using System.Collections.Generic;

namespace CarsIntegration.Services
{
    public class CarsService : ICarsService
    {
        private readonly ICars _carsRepository;

        public CarsService(ICars carsRepository)
        {
            _carsRepository = carsRepository;
        }

        public Reservation CreateReservation(Reservation reservation)
        {
            return _carsRepository.CreateReservation(reservation);
        }

        public IEnumerable<Cars> GetCars(DateTime startDate, DateTime endDate)
        {
            return _carsRepository.GetCars(startDate, endDate);
        }


        public Reservation GetReservationById(int id)
        {
            return _carsRepository.GetReservationById(id);
        }
        public IEnumerable<Reservation2> GetReservationsByUserIdWithCarDetails(int userId)
        {
            // Assuming _carsRepository has a method to fetch reservations by UserID with car details
            return _carsRepository.GetReservationsByUserIdWithCarDetails(userId);
        }
        public void DeleteReservationAndUpdateCar(int reservationId)
        {
            _carsRepository.DeleteReservationAndUpdateCar(reservationId);
        }
        public Cars InsertCar(Cars car)
        {
            return _carsRepository.InsertCar(car);
        }
        public Reservation CreateBill(Bill bill)
        {
            return _carsRepository.CreateBill(bill);
        }


        public IEnumerable<Bill2> GetBillsByUserIdWithCarDetails(int userId)
        {
            return _carsRepository.GetBillsByUserIdWithCarDetails(userId);
        }

        public IEnumerable<Bill2> GetBillsWithCarDetails()
        {
            return _carsRepository.GetBillsWithCarDetails();
        }

        public Review InsertReview(Review review)
        {
           return  _carsRepository.InsertReview(review);
        }

        public IEnumerable<Review> GetReviewsByCarID(int carID)
        {
            return _carsRepository.GetReviewsByCarID(carID);
        }

        public Image GetImageByCarID(int carID)
        {
            return _carsRepository.GetImageByCarID(carID);
        }
        public void InsertImage(Image image)
        {
            _carsRepository.InsertImage(image);
        }
    }
}