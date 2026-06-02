import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor de banco de dados.';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[]) || [];
        const fields = target.join(', ');
        message = `Conflito de duplicidade: Já existe um registro com os valores informados para o(s) campo(s): ${fields || 'valor único'}.`;
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'O registro solicitado não foi encontrado ou não existe no banco de dados.';
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Operação bloqueada: o registro está vinculado a outra entidade ativa e não pode ser removido ou alterado por questões de integridade.';
        break;
      }
      default:
        message = `Erro não tratado no banco de dados (${exception.code}): ${exception.message}`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: this.getHttpStatusName(status),
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getHttpStatusName(status: number): string {
    switch (status) {
      case 400: return 'Bad Request';
      case 404: return 'Not Found';
      case 409: return 'Conflict';
      default: return 'Internal Server Error';
    }
  }
}
