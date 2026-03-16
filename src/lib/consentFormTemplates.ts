const DENTAL_FILLING_TEMPLATE =
	"I mr/ms/mrs {name_of_patient} aged {patient_age}, {patient_gender}, have been explained by the Dr. {doctor_name} about the need for Dental filling in relation to the tooth numbered {tooth_numbers} and I have been explained about the procedure in detail including drilling of the tooth to remove the decay and placement of a Dental filling and if not treated, decay can progress and cause pain and infection. The options for dental filling materials were discussed and finalised with me. I have been explained the slight possibility of exposing the pulp (nerve of the tooth) while removal of the decay and developing pain at a later date when decay removal is close to the pulp (nerve of the tooth) and in such a case the need to undergo root canal treatment has been explained. Post-operative complications like pain and sensitivity for few days have been explained. I hereby agree to undergo the Dental filling and agree to follow-up with the doctor as per his/her advice.";

const RCT_TEMPLATE =
	"I mr/ms/mrs {name_of_patient} aged {patient_age}, {patient_gender}, have been explained by the Dr. {doctor_name} about the need for Root Canal Treatment/ Therapy in relation to the tooth numbered {tooth_numbers} and I have been explained about the procedure in detail including injection of local anaesthesia, drilling of a small hole (access cavity) in the tooth to clear the infection and placement of a crown later. If not treated pain and swelling can increase because of the infection of the tooth and sometimes can be threat to life as well. An alternative option of extraction of the tooth has been explained. Post-operative sequel like pain and swelling for few days have been explained. I hereby agree to undergo the root canal treatment and agree to follow-up with the doctor as per his/her advice.";

export type ConsentFormType = "filling" | "rct";

export const FORM_TYPE_OPTIONS = [
	{ value: "filling" as const, label: "Dental Filling" },
	{ value: "rct" as const, label: "Root Canal Treatment (RCT)" },
];

export type ConsentVars = {
	name_of_patient: string;
	patient_age: string;
	patient_gender: string;
	doctor_name: string;
	tooth_numbers: string;
};

export function fillConsentTemplate(type: ConsentFormType, vars: ConsentVars): string {
	const template = type === "filling" ? DENTAL_FILLING_TEMPLATE : RCT_TEMPLATE;
	return template
		.replace("{name_of_patient}", vars.name_of_patient)
		.replace("{patient_age}", vars.patient_age)
		.replace("{patient_gender}", vars.patient_gender)
		.replace("{doctor_name}", vars.doctor_name)
		.replace("{tooth_numbers}", vars.tooth_numbers);
}

export function getFormTypeLabel(type: ConsentFormType): string {
	return FORM_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}
