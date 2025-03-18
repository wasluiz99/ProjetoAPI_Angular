using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Projeto_Angular.Application.Dtos;
using Projeto_Angular.Domain;

namespace Projeto_Angular.Application.Helpers
{
    public class ProjetoAngularProfile : Profile
    {
        public ProjetoAngularProfile()
        {
            CreateMap<Evento, EventoDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
        }
    }
}