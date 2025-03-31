using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Projeto_Angular.Domain;
using Projeto_Angular.Persistence.Models;

namespace Projeto_Angular.Persistence.Contratos
{
    public interface IEventoPersist
    {

        //EVENTOS
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes);
        Task<Evento> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes);

    }
}