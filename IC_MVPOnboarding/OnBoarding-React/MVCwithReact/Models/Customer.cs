using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;


namespace MVC_with_React.Models
{
    public class Customer
    {
            [Key]
            public int CustomerId { get; set; }

            [Required(ErrorMessage = "Please enter a Customer name")]
            public string Name { get; set; }

            [Required(ErrorMessage = "Please enter an Address")]
            public string Address { get; set; }


    }
    
}
