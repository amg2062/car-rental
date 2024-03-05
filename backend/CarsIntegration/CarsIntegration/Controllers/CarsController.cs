using Microsoft.AspNetCore.Mvc;
using CarsIntegration.Services.Interfaces;
using CarsIntegration.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace CarsIntegration.Controllers
{
    
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    
    public class CarsController : Controller
    {
        private readonly ICarsService _carsService;

        public CarsController(ICarsService carsService)
        {
            _carsService = carsService;
        }

        /* [HttpGet]
         [Route("")]
         public IActionResult GetCars()
         {
             var cars = _carsService.GetCars();
             return Ok(cars);
         }*/

        /*  [HttpPost]
          [Route("create-reservation")]
          public IActionResult CreateReservation([FromBody] Reservation reservation)
          {
              if (!ModelState.IsValid)
              {
                  return BadRequest(ModelState);
              }

              var createdReservation = _carsService.CreateReservation(reservation);
              return CreatedAtAction(nameof(GetReservationById), new { id = createdReservation }, createdReservation);

          }*/
        [Authorize(Roles = "Customer,Admin")]
        [HttpGet("{id}")]
        public IActionResult GetReservationById(int id)
        {
            var reservation = _carsService.GetReservationById(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        //
        [Authorize(Roles = "Customer,Admin")]
        [HttpGet]
        [Route("")]
        public IActionResult GetCars([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var duration = (endDate - startDate).TotalHours;
            var cars = _carsService.GetCars(startDate,endDate).Select(car => new Cars
            {
                CarID = car.CarID,
                Manufacturer = car.Manufacturer,
                Model = car.Model,
                TransmissionType = car.TransmissionType,

                YearOfManufacture=car.YearOfManufacture,
                CostPerHour=car.CostPerHour,
                Mileage=car.Mileage,

                TotalCost = (decimal)duration * car.CostPerHour
            }); 
            return Ok(cars);
        }

        //
       [AllowAnonymous]
        [HttpPost]
        [Route("create-reservation")]
        public IActionResult CreateReservation( Models.Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdReservation = _carsService.CreateReservation(reservation);
            return CreatedAtAction(nameof(GetReservationById), new { id = createdReservation }, createdReservation);
        }

        //
        //
        [Authorize(Roles = "Customer,Admin")]
        [HttpGet("reservations/{userId}")]
        public IActionResult GetReservationsByUserIdWithCarDetails(int userId)
        {
            var reservations = _carsService.GetReservationsByUserIdWithCarDetails(userId);

            if (reservations == null || !reservations.Any())
            {
                return NotFound();
            }

            return Ok(reservations);
        }
        //


        //
        [Authorize(Roles = "Customer,Admin")]
        [HttpDelete("delete-reservation/{reservationId}")]
public IActionResult DeleteReservationAndUpdateCar(int reservationId)
{
    _carsService.DeleteReservationAndUpdateCar(reservationId);
    return Ok();
}
        //


        //
        [Authorize(Roles = "Admin, Employee")]
        [HttpPost]
        [Route("create-car")]
        public IActionResult CreateCar([FromBody] Cars car)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdCar = _carsService.InsertCar(car);
            return Ok(createdCar);
        }
        //

        [Authorize(Roles = "Customer,Admin")]
        [HttpPost]
        [Route("create-bill")]
        public IActionResult CreateBill([FromBody] Bill bill)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdBill = _carsService.CreateBill(bill);
            return CreatedAtAction(nameof(GetReservationById), new { id = createdBill.ReservationID }, createdBill);
        }

        [Authorize(Roles = "Customer,Admin")]
        [HttpGet("bills/{userId}")]
        public IActionResult GetBillsByUserIdWithCarDetails(int userId)
        {
            var bills = _carsService.GetBillsByUserIdWithCarDetails(userId);

            if (bills == null || !bills.Any())
            {
                return NotFound();
            }

            return Ok(bills);
        }

        [Authorize(Roles = "Customer,Admin, Employee")]
        [HttpGet("bills")]
        public IActionResult GetBillsWithCarDetails()
        {
            var bills = _carsService.GetBillsWithCarDetails();

            if (bills == null || !bills.Any())
            {
                return NotFound();
            }

            return Ok(bills);
        }

        
        [HttpPost("create-review")]
        public IActionResult CreateReview([FromBody] Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _carsService.InsertReview(review);
            return Ok();
        }
     
        [HttpGet("reviews/{carID}")]
        public IActionResult GetReviewsByCarID(int carID)
        {
            var reviews = _carsService.GetReviewsByCarID(carID);

            if (!reviews.Any())
            {
                return NotFound();
            }

            return Ok(reviews);
        }
    }
}
