import { Test, TestingModule } from '@nestjs/testing';
import { SisPermissoesController } from './sis-permissoes.controller';
import { SisPermissoesService } from './sis-permissoes.service';

describe('SisPermissoesController', () => {
  let controller: SisPermissoesController;
  let service: SisPermissoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SisPermissoesController],
      providers: [
        {
          provide: SisPermissoesService,
          useValue: {
            getPermissoesByUsuarioId: jest.fn(),
            createPermissao: jest.fn(),
            updatePermissao: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<SisPermissoesController>(SisPermissoesController);
    service = module.get<SisPermissoesService>(SisPermissoesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getPermissoes calls service', async () => {
    await controller.getPermissoes('abc');
    expect(service.getPermissoesByUsuarioId).toHaveBeenCalledWith('abc');
  });

  it('createPermissao calls service', async () => {
    await controller.createPermissao('abc', 'modulo', 'tela', { visualizar: true });
    expect(service.createPermissao).toHaveBeenCalledWith({
      usuario_id: 'abc',
      modulo: 'modulo',
      tela: 'tela',
      visualizar: true,
    });
  });

  it('updatePermissao calls service', async () => {
    await controller.updatePermissao('abc', 'modulo', 'tela', { editar: true });
    expect(service.updatePermissao).toHaveBeenCalledWith({
      usuario_id: 'abc',
      modulo: 'modulo',
      tela: 'tela',
      editar: true,
    });
  });
});
