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
    public class LotePersist : ILotePersist
    {
        private readonly Projeto_AngularContext _context;
        public LotePersist(Projeto_AngularContext context)
        {
            _context = context;
            
        }

        public async Task<Lote[]> GetLotesByEventosIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(l => l.EventoId == eventoId);

            return await query.ToArrayAsync();
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(l => l.EventoId == eventoId
                                && l.Id == id);

            return await query.FirstOrDefaultAsync();
        }
    }
}