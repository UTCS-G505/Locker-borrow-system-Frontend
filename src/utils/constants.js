class Role {
    static ADMIN = 0;
    static OFFICER = 1;
    static DIRECTOR = 2;
    static TEACHER = 3;
    static STUDENT = 4;
    static UT_USER = 5;
    static GUEST = 6;

    static SystemManagerRoles =  [
        this.ADMIN,
        this.OFFICER
    ];

    static SystemUserRoles = [
        this.ADMIN,
        this.OFFICER,
        this.DIRECTOR,
        this.TEACHER,
        this.STUDENT
    ];
}

export { Role }
