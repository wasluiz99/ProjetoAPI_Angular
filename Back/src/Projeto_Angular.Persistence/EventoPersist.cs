using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projeto_Angular.Domain;
using Projeto_Angular.Persistence.Context;
using Projeto_Angular.Persistence.Contratos;
using Projeto_Angular.Persistence.Models;

namespace Projeto_Angular.Persistence
{
    public class EventoPersist : IEventoPersist
    {
        private readonly Projeto_AngularContext _context;
        public EventoPersist(Projeto_AngularContext context)
        {
            _context = context;
            
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if(includePalestrantes)
            {
                query = query
                .Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);                     
            }

            query = query.AsNoTracking()
                         .Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                                     e.Local.ToLower().Contains(pageParams.Term.ToLower())) &&
                                    e.UserId == userId)
                        .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if(includePalestrantes)
            {
                query = query
                .Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);                     
            }

            query = query.AsNoTracking().OrderBy(e => e.Id)
                         .Where(e => e.Id == eventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }       

    }
}