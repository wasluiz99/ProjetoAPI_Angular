using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Projeto_Angular.Domain;
using Projeto_Angular.Domain.identity;

namespace Projeto_Angular.Persistence.Context
{
    public class Projeto_AngularContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, 
                                                            UserRole, IdentityUserLogin<int>, 
                                                            IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public Projeto_AngularContext(DbContextOptions<Projeto_AngularContext> options) 
        : base(options){ }
        public DbSet<Evento> Eventos {get; set;}
        public DbSet<Palestrante> Palestrantes {get; set;}
        public DbSet<Lote> Lotes {get; set;}
        public DbSet<PalestranteEvento> PalestrantesEventos {get; set;}
        public DbSet<RedeSocial> RedesSociais {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)

        {
               //alteração
            builder.ApplyConfigurationsFromAssembly(typeof(Projeto_AngularContext).Assembly);
                 //alteração
            foreach (var relationship in builder.Model.GetEntityTypes()

             .SelectMany(e => e.GetForeignKeys())) relationship.DeleteBehavior = DeleteBehavior.ClientSetNull;

            base.OnModelCreating(builder);

            builder.Entity<UserRole>(userRole =>

            {

                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });
                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)

                    .WithMany(r => r.UserRoles)

                    .HasForeignKey(ur => ur.UserId)

                    .IsRequired();

            }

            );

            builder.Entity<PalestranteEvento>()
                 .HasKey(PE => new { PE.EventoId, PE.PalestranteId });
            builder.Entity<Evento>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Evento)
               .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Palestrante>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Palestrante)
                .OnDelete(DeleteBehavior.Cascade);

        }

    }
}