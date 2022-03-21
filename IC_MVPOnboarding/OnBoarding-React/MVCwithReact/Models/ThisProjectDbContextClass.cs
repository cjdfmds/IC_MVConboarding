using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace MVC_with_React.Models
{
    public class ThisProjectDbContextClass : DbContext
    {

        //This is to link with the sql database
        public ThisProjectDbContextClass(DbContextOptions<ThisProjectDbContextClass> options) : base(options)
        {

        }


        //Database for each of the Classes
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<Store> Store { get; set; }
        public DbSet<Sales> Sales { get; set; }




    }
}
