using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Projeto_Angular.Domain;

namespace Projeto_Angular.Persistence.Contratos
{
    public interface IEventoPersist
    {

        //EVENTOS
        Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes);
        Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes);
        Task<Evento> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes);

    }
}