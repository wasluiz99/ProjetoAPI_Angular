using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Projeto_Angular.Domain;

namespace Projeto_Angular.Persistence.Contratos
{
    public interface IGeralPersist
    {

        //GERAL
        void add<T>(T entity) where T: class;
        void Update<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        void DeleteRange<T>(T[] entity) where T: class;

        Task<bool> SaveChangesAsynk();

    }
}