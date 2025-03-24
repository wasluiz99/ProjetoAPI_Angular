using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Projeto_Angular.Application.Contratos;
using Projeto_Angular.Application.Dtos;
using Projeto_Angular.Domain;
using Projeto_Angular.Persistence.Contratos;

namespace Projeto_Angular.Application
{
    public class LoteService : ILoteService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;

        public LoteService(IGeralPersist geralPersist, 
                             ILotePersist lotePersist,
                             IMapper mapper)
        {
            _lotePersist = lotePersist;
            _mapper = mapper;
            _geralPersist = geralPersist;
            
        }
        
        public async Task AddLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;

                _geralPersist.add(lote);

                await _geralPersist.SaveChangesAsynk();

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventosIdAsync(eventoId);
                if(lotes == null) return null;

                foreach (var model in models)
                {
                     if(model.Id == 0)
                     {
                        await AddLote(eventoId, model);
                     }
                     else
                     {

                        var lote = lotes.FirstOrDefault(l => l.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, lote);

                        _geralPersist.Update(lote);

                        await _geralPersist.SaveChangesAsynk();
                     }
                }

                             
                var loteRetorno = await _lotePersist.GetLotesByEventosIdAsync(eventoId);

                return _mapper.Map<LoteDto[]>(loteRetorno);
                

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) throw new Exception("Lote para delete nao encontrado");

                _geralPersist.Delete<Lote>(lote);
                return await _geralPersist.SaveChangesAsynk();


            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventosIdAsync(eventoId);
                if(lotes == null) return null;

                var resultados = _mapper.Map<LoteDto[]>(lotes);

                return resultados;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) return null;

                var resultado = _mapper.Map<LoteDto>(lote);

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
    }
}