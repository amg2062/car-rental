namespace CarsIntegration.Models
{
    public class Bill2
    {
        public int BillID { get; set; }
        public int ReservationID { get; set; }
        public int UserID { get; set; }
        public int CarID { get; set; }
        public DateTime ReservationStart { get; set; }
        public DateTime ReservationEnd { get; set; }
        public decimal TotalCarCost { get; set; }

        public Cars CarDetails { get; set; }
    }
}
