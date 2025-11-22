import { Test, TestingModule } from '@nestjs/testing';
import { SisPermissoesRepository } from './sis-permissoes.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('SisPermissoesRepository', () => {
  let repository: SisPermissoesRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SisPermissoesRepository, {
        provide: PrismaService,
        useValue: {
          sis_permissoes: {
            findMany: jest.fn(),
            create: jest.fn(),
            updateMany: jest.fn(),
          },
        },
      }],
    }).compile();
    repository = module.get<SisPermissoesRepository>(SisPermissoesRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findByUsuarioId calls prisma', async () => {
    await repository.findByUsuarioId('abc');
    expect(prisma.sis_permissoes.findMany).toHaveBeenCalledWith({ where: { usuario_id: 'abc' } });
  });

  it('createOne calls prisma.create', async () => {
    const dto = { usuario_id: 'abc', modulo: 'mod', tela: 'tela', visualizar: true };
    await repository.createOne(dto as any);
    expect(prisma.sis_permissoes.create).toHaveBeenCalledWith({ data: dto });
  });

  it('updateOne calls prisma.updateMany', async () => {
    const dto = {
      usuario_id: 'abc',
      modulo: 'mod',
      tela: 'tela',
      visualizar: true,
      editar: false,
      criar: false,
      deletar: false,
    };
    await repository.updateOne(dto as any);
    expect(prisma.sis_permissoes.updateMany).toHaveBeenCalledWith({
      where: {
        usuario_id: dto.usuario_id,
        modulo: dto.modulo,
        tela: dto.tela,
      },
      data: {
        visualizar: dto.visualizar,
        editar: dto.editar,
        criar: dto.criar,
        deletar: dto.deletar,
      },
    });
  });
});
