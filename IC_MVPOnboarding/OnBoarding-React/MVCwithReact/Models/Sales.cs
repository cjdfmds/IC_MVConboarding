using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace MVC_with_React.Models
{
    public class Sales
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Please enter a Product Price")]
        public string ProductId { get; set; }

        [Required(ErrorMessage = "Please enter a Customer name")]
        public string CustomerId { get; set; }

        [Required(ErrorMessage = "Please enter a Store name")]
        public string StoreId { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public string DateSold { get; set; }

        public Customer customer;
        public Store store;
        public Product product;

    }
}
