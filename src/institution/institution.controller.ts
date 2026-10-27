import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionService } from './institution.service';

@Controller('institution')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Get()
  findAll() {
    return this.institutionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionService.findOne(+id);
  }

  @Get('nombre/:nombre')
  findByNombre(@Param('nombre') nombre: string) {
    return this.institutionService.findByNombre(nombre);
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.institutionService.findByEstado(estado);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionService.update(+id, updateInstitutionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.institutionService.remove(+id);
  }
}
