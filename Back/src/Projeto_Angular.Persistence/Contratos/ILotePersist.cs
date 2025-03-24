using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Projeto_Angular.Domain;

namespace Projeto_Angular.Persistence.Contratos
{
    public interface ILotePersist
    {

        //EVENTOS
        Task<Lote[]> GetLotesByEventosIdAsync(int eventoId);
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);

    }
}