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
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist, 
                             IEventoPersist eventoPersist,
                             IMapper mapper)
        {
            _eventoPersist = eventoPersist;
            _mapper = mapper;
            _geralPersist = geralPersist;
            
        }
        
        public async Task<EventoDto> AddEventos(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _geralPersist.add(evento);

                if(await _geralPersist.SaveChangesAsynk())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);

                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEventos(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) return null;

                model.Id = evento.Id;

                _mapper.Map(model, evento);

                _geralPersist.Update(evento);

                if(await _geralPersist.SaveChangesAsynk())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);

                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if(evento == null) throw new Exception("Evento para delete nao encontrado");

                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsynk();


            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if(eventos == null) return null;

                var resultados = _mapper.Map<EventoDto[]>(eventos);

                return resultados;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if(eventos == null) return null;

                var resultados = _mapper.Map<EventoDto[]>(eventos);

                return resultados;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if(evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }


    }
}