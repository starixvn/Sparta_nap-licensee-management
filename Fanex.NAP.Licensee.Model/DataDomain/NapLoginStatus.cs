namespace Fanex.NAP.Licensee.Model.DataDomain
{
    /// <summary>
    /// NapLoginStatus class.
    /// </summary>
    public enum NapLoginStatus
    {
        /// <summary>
        /// The login successful.
        /// </summary>
        LoginSuccessful,

        /// <summary>
        /// The invalid username or password.
        /// </summary>
        InvalidUsernameOrPassword,

        /// <summary>
        /// The user suspended.
        /// </summary>
        UserSuspended,

        /// <summary>
        /// The user no authorization.
        /// </summary>
        UserNoAuthorization,

        /// <summary>
        /// The user no menu permission.
        /// </summary>
        UserNoMenuPermission,

        ValidatedSuccess
    }
}