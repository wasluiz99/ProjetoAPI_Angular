using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto_Angular.Domain;
using Projeto_Angular.Persistence.Context;
using Projeto_Angular.Persistence.Contratos;

namespace Projeto_Angular.Persistence
{
    public class GeralPersist : IGeralPersist
    {
        private readonly Projeto_AngularContext _context;
        public GeralPersist(Projeto_AngularContext context)
        {
            _context = context;
            
        }

        public void add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _context.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsynk()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

    }
}