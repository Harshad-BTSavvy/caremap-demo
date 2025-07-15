import { createPatient, getPatient, getPatientByUserId } from "@/services/core/PatientService";
import { createUser, isExistingUser } from "@/services/core/UserService";
import { Patient, User } from "@/services/database/migrations/v1/schema_v1";


export async function syncPatientSession(user: User): Promise<Patient> {
    if (!user?.id) {
        throw new Error("User session missing");
    }

    // Storing user in DB if not already exists
    const existingUser = await isExistingUser(user.id);
    if (!existingUser) {
        await createUser(user);
    }

    // Get patient by user_id
    const existingPatient = await getPatientByUserId(user.id);
    if (existingPatient) {
        // Get patient by patient id
        const fullPatient = await getPatient(existingPatient.id);
        if (!fullPatient) throw new Error("Patient fetch failed.");
        return fullPatient;
    }

    // Create patient with name split into first and last name
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    
    let newPatient = await createPatient({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName
    });
    
    if (!newPatient) throw new Error("Patient creation failed.");

    return newPatient;
}
