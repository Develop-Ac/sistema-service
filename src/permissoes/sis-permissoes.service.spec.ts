import { Test, TestingModule } from '@nestjs/testing';
import { SisPermissoesService } from './sis-permissoes.service';
import { SisPermissoesRepository } from './sis-permissoes.repository';

describe('SisPermissoesService', () => {
  let service: SisPermissoesService;
  let repository: SisPermissoesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SisPermissoesService, {
        provide: SisPermissoesRepository,
        useValue: {
          findByUsuarioId: jest.fn(),
          createMany: jest.fn(),
          updateMany: jest.fn(),
        },
      }],
    }).compile();
    service = module.get<SisPermissoesService>(SisPermissoesService);
    repository = module.get<SisPermissoesRepository>(SisPermissoesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getPermissoesByUsuarioId calls repository', async () => {
    await service.getPermissoesByUsuarioId('abc');
    expect(repository.findByUsuarioId).toHaveBeenCalledWith('abc');
  });

  it('createPermissao calls repository', async () => {
    const dto = { usuarioId: 'abc' } as any;
    await service.createPermissao(dto);
    expect(repository.createOne).toHaveBeenCalledWith(dto);
  });

  it('updatePermissao calls repository', async () => {
    const dto = { usuarioId: 'abc' } as any;
    await service.updatePermissao(dto);
    expect(repository.updateOne).toHaveBeenCalledWith(dto);
  });
});
