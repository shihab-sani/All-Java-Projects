package patient.management.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import patient.management.DTOs.PatientRequestDto;
import patient.management.DTOs.PatientResponseDto;
import patient.management.Mapper.PatientMapper;
import patient.management.ModelClasses.Patient;
import patient.management.Repositories.PatientRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public List<PatientResponseDto> getPatients() {
        List<Patient>  patients = patientRepository.findAll();
        return patients.stream().map(patientMapper::toDto).toList();
    }

    public PatientResponseDto createPatient(PatientRequestDto patientRequestDto) {
        Patient patient = patientMapper.toEntity(patientRequestDto);
        Patient newPatient = patientRepository.save(patient);
        return patientMapper.toDto(newPatient);
    }
}
