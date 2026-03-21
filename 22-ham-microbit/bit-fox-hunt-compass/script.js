/**
 * bit-fox-hunt-compass — Workshop DIY v1.0
 * Fox Hunt Transmitter Finder Simulation
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 * Easter eggs: Konami, Morse, Matrix rain, Debug, Shake report, Time-travel, Typewriter
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG (injected once) ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="77.139885 78.322945 253.991455 136.254120"> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797zM208.415588,151.261307L201.927002,151.261307L201.927002,154.5056L208.415588,154.5056L208.415588,151.261307zM195.438385,167.485199L192.194092,167.485199L192.194092,151.263702L195.438385,151.263702L195.438385,167.485199zM214.904205,167.485199L211.659897,167.485199L211.659897,151.263702L214.904205,151.263702L214.904205,167.485199zM201.927002,173.973801L198.682693,173.973801L198.682693,164.240906L205.171295,164.240906L205.171295,160.996597L201.927002,160.996597L201.927002,157.752304L208.415588,157.752304L208.415588,167.485199L201.927002,167.485199L201.927002,173.973801z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M173.301086,159.585083C173.612106,158.491119,173.874039,158.032059,174.626434,157.262268C175.395889,156.475021,176.401733,155.870239,176.941635,155.870239C177.36203,155.870239,177.647339,155.263535,177.647339,154.369537C177.647339,153.240067,178.097351,153.01268,180.332611,153.01268C181.328247,153.01268,182.282974,153.064713,182.454239,153.128311C182.730774,153.231003,182.765625,154.070618,182.765625,160.629913C182.765625,166.947327,182.723099,168.050049,182.471725,168.251938C182.069794,168.574738,178.407364,168.435822,177.965607,168.081009C177.75119,167.908813,177.647324,167.518738,177.647324,166.885712L177.647324,165.94603L176.584106,165.490997C175.198334,164.897919,174.243912,164.070435,173.733398,163.019424C173.265182,162.055481,173.060654,160.43071,173.301086,159.585083z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.601929,182.059692C154.740814,179.364502,156.707062,177.959259,159.536469,177.818451C160.701721,177.760437,161.251312,177.831604,162.144165,178.156082C163.450592,178.630859,165.150406,180.036514,165.749542,181.137527L166.150391,181.874146L171.23761,181.874146C175.554565,181.874146,176.349976,181.830872,176.490891,181.588379C176.673401,181.274307,177.547806,179.367874,178.631622,176.921021C179.274582,175.469437,179.523499,174.921753,180.081848,173.730072L180.595093,172.634674L182.95993,172.634674C184.912933,172.634674,185.324768,172.683594,185.324768,172.915649C185.324768,173.07019,185.049423,173.777435,184.712891,174.487305C184.376358,175.197189,183.943024,176.163757,183.749908,176.635269C183.556793,177.106766,183.115692,178.092621,182.769699,178.826065C182.423691,179.559509,182.025787,180.416779,181.885452,180.73111C181.745102,181.045441,181.453796,181.6884,181.238083,182.159897C181.022369,182.631409,180.643311,183.488678,180.395737,184.064957C179.824722,185.394073,179.204605,186.048218,178.254486,186.3237C177.765457,186.465485,175.502716,186.541504,171.771988,186.541504L166.040741,186.541504L165.659912,187.255905C165.138397,188.234222,163.85675,189.437042,162.748398,189.988312C161.961212,190.379837,161.551163,190.446259,159.943237,190.442749C158.273651,190.439087,157.93721,190.378052,156.97731,189.904602C155.279343,189.067123,154.253754,187.938721,153.568604,186.154144C153.151855,185.06868,153.167999,183.086639,153.601929,182.059692z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M153.70961,134.681961C154.933441,131.8022,158.021027,130.114639,160.98288,130.70665C163.119888,131.133804,164.512604,132.063324,165.540604,133.74852L166.13118,134.71666L172.036896,134.724625C179.724121,134.734985,179.189514,134.531769,180.806213,138.05806C181.046387,138.58194,181.506516,139.56781,181.828705,140.248856C182.150894,140.929916,182.572266,141.873413,182.765106,142.34552C182.957932,142.817627,183.418945,143.846344,183.789566,144.631577C184.160187,145.416794,184.582855,146.359299,184.72879,146.726013C184.874741,147.092743,185.068542,147.474228,185.159454,147.573761C185.250381,147.673309,185.324768,147.911697,185.324768,148.103516C185.324768,148.42543,185.139572,148.448166,182.920441,148.398804C180.143387,148.337021,180.601318,148.697861,179.105072,145.392487C178.607056,144.292328,177.979095,142.920685,177.709595,142.344406C177.440109,141.768127,177.087021,140.996597,176.924942,140.629868C176.762878,140.263153,176.561615,139.834503,176.477676,139.677338C176.349091,139.436539,175.522827,139.383606,171.225388,139.340881L166.125702,139.290192L165.734726,140.000244C165.222015,140.931427,163.772217,142.287949,162.807831,142.738846C160.99057,143.588516,158.677109,143.612717,156.992996,142.799698C155.47348,142.066116,154.281479,140.67366,153.456284,138.668228C153.079697,137.753036,153.198425,135.884811,153.70961,134.681961z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M142.359467,157.940231C142.509399,157.475464,142.773041,156.807739,142.945313,156.45639C143.301086,155.73085,144.960602,154.086121,145.719666,153.706772C147.453094,152.840485,150.120728,152.779083,151.897141,153.564621C153.038162,154.069183,154.633179,155.561859,155.143616,156.602798L155.49057,157.310364L162.396606,157.310364L169.302643,157.310364L169.245392,159.621033L169.188141,161.931702L162.336823,161.983459L155.485474,162.035233L154.951477,162.917023C154.333344,163.937775,152.845825,165.267944,151.815979,165.720886C151.320953,165.938599,150.48027,166.037445,149.070404,166.043716C147.337799,166.051422,146.909668,165.986923,146.165497,165.606079C144.226196,164.613617,142.876617,163.016098,142.361877,161.103683C141.998642,159.754135,141.998108,159.060349,142.359467,157.940231z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789734,195.730286L203.964523,195.730286L203.964523,199.334839L330.789734,199.334839L330.789734,195.730286z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789551,203.350861L161.68924,203.350861L161.68924,206.955414L330.789551,206.955414L330.789551,203.350861z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M199.007599,92.751289L211.076767,107.812828L202.108658,108.433113L193.221268,96.996552L191.912918,99.119194L192.604614,109.090935L185.184021,109.604782L183.137482,80.08474L190.55806,79.571373L191.466415,92.675797L200.002396,78.91729L208.593674,78.322945L199.007599,92.751289z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M234.138016,81.615562C236.040375,81.751511,237.914093,82.153725,239.704468,82.81044C242.302017,83.709618,244.733612,85.0299,246.901871,86.718407L245.150757,93.244476L244.516693,93.074516L244.196808,92.630768C242.70787,90.69416,240.767151,89.152077,238.543442,88.138672C237.43634,87.647743,236.259094,87.333046,235.05455,87.206039C234.227158,87.13401,233.394257,87.239655,232.611099,87.515953C232.1866,87.685104,231.808258,87.952736,231.507553,88.296593C230.788803,89.172775,230.813843,90.439911,231.566635,91.287064C232.032272,91.758965,232.559708,92.165504,233.134735,92.49572C233.880844,92.934601,234.641342,93.348839,235.414795,93.73764L236.692566,94.414246C238.063751,95.136879,239.357956,95.996429,240.555618,96.979881C241.421173,97.700912,242.148926,98.572769,242.70343,99.552994C243.199982,100.455551,243.47139,101.464417,243.494675,102.49408C243.516479,104.315857,243.04805,106.109734,242.138275,107.688644C241.268204,109.142014,239.979233,110.299194,238.440216,111.008636C236.697495,111.816132,234.786774,112.195747,232.867447,112.115822C231.006363,112.044464,229.16304,111.7258,227.386139,111.168236C225.295883,110.581566,223.299759,109.70047,221.458069,108.551567C220.391022,107.90168,219.366867,107.183914,218.391983,106.402733L220.215729,99.607994L220.868774,99.782715L221.294846,100.371597C223.248032,102.98111,225.940598,104.943588,229.023956,106.004974C230.198563,106.381287,231.426422,106.56295,232.65976,106.542908C233.398315,106.50238,234.108765,106.246048,234.70285,105.805771C235.495346,105.106613,235.762222,103.987152,235.3703,103.006096C234.953918,102.254745,234.346375,101.627075,233.608734,101.186172C232.310593,100.437439,230.990005,99.728287,229.648743,99.059662L228.913788,98.6465C227.703781,97.972984,226.583435,97.149826,225.579315,96.196541C224.730804,95.402397,224.063187,94.435135,223.621811,93.360443C223.239136,92.341805,223.078842,91.253273,223.151657,90.167679C223.224899,88.937332,223.518707,87.730194,224.019104,86.603645C224.773438,84.973534,226.068161,83.653664,227.684143,82.867416C229.688202,81.891472,231.914063,81.459724,234.138016,81.615562z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M158.184418,89.408417L158.63797,89.460617C160.159576,89.664032,161.581177,90.331436,162.709152,91.371941C163.457062,92.134872,164.054443,93.031792,164.469971,94.015739C164.905151,94.958809,165.210938,95.956268,165.379028,96.981071C165.586273,98.309639,165.448776,99.669395,164.979736,100.929688C164.526001,102.206253,163.843109,103.389481,162.9646,104.421295L177.202927,111.835213L168.925079,115.537735L156.954742,109.003616L154.522186,110.091713L158.959137,119.99498L152.206207,123.015327L140.106628,96.007126L150.980728,91.143959C152.423172,90.469635,153.929443,89.940933,155.477051,89.56575C156.366608,89.378746,157.27916,89.325714,158.184418,89.408417zM154.518402,95.879517C153.797302,95.981628,153.094345,96.184746,152.429993,96.482941C151.30661,96.954544,150.192154,97.445801,149.086243,97.956879L152.344727,105.230492C153.226166,104.854858,154.099228,104.460068,154.963409,104.046356C155.701569,103.707794,156.398712,103.2864,157.041443,102.79026C157.931732,102.040565,158.426819,100.923943,158.384399,99.761368C158.265366,98.633255,157.799194,97.57048,157.049652,96.718483C156.493423,96.132034,155.708206,95.817314,154.900574,95.857086L154.518402,95.879517z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M272.812744,97.204483L266.643219,106.109734L274.967194,111.866898L281.13623,102.961639L287.252136,107.192093L270.397125,131.522263L264.281219,127.291809L271.751953,116.507477L263.428467,110.75032L255.957245,121.534653L249.841339,117.304688L266.69635,92.974518L272.812744,97.204483z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M123.532295,113.696442L124.230148,113.777771C126.158524,114.073517,128.005737,114.761353,129.657501,115.798744C132.481201,117.587387,134.876709,119.973488,136.675644,122.789276C137.85083,124.63147,138.576599,126.723907,138.794327,128.897644C139.033569,131.465439,138.466858,134.044128,137.172913,136.275513C135.587463,138.969635,133.343018,141.21608,130.649414,142.80484C127.777443,144.458344,124.36438,144.902039,121.164574,144.037842C119.23671,143.51442,117.427086,142.626587,115.833755,141.422424C113.593025,139.763062,111.674324,137.709213,110.171577,135.361511C108.996712,133.520187,108.266281,131.430969,108.038124,129.259201C107.781654,126.690132,108.338432,124.10524,109.629959,121.869064C111.213356,119.173782,113.45533,116.925095,116.146744,115.332764C118.378197,114.032959,120.960136,113.460907,123.532295,113.696442zM120.237076,120.379318L119.887573,120.406281C118.354965,120.610733,116.961685,121.401001,116.000389,122.611092C115.056374,123.703064,114.59684,125.132736,114.727959,126.569733C114.794571,127.523895,115.040863,128.456757,115.453972,129.31958C116.053543,130.618454,116.854576,131.814713,117.827431,132.864029C118.900902,134.079971,120.115646,135.163635,121.446014,136.092072C122.648727,136.917191,124.021584,137.461685,125.463211,137.685394C127.280067,137.943146,129.110855,137.312714,130.383087,135.991302C131.89679,134.496063,132.46991,132.291229,131.875671,130.248962C131.491013,128.764099,130.784729,127.381737,129.806686,126.199554C128.542725,124.617355,127.058746,123.224152,125.399681,122.062111C124.287796,121.300659,123.037567,120.763733,121.719482,120.481628C121.230911,120.390747,120.733513,120.356422,120.237076,120.379318z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M301.601013,126.300751L302.299225,126.387955C304.863129,126.784752,307.239716,127.969833,309.098511,129.778381C311.170715,131.775146,312.75058,134.224945,313.714081,136.935547C314.870911,140.295837,314.546234,143.989166,312.820984,147.096512C311.958069,148.639557,310.845917,150.029465,309.529388,151.210129C307.452698,153.100769,305.048676,154.597107,302.434753,155.626007C300.399414,156.423401,298.204712,156.731628,296.028259,156.525696C293.460388,156.265411,291.037109,155.212799,289.095093,153.514084C286.754761,151.440582,284.981323,148.806931,283.940704,145.859634C282.870056,142.725098,283.092163,139.293045,284.557861,136.322372C285.44342,134.53299,286.664185,132.92984,288.153931,131.599777C290.215515,129.722946,292.602142,128.237671,295.197113,127.216599C297.231812,126.41954,299.424255,126.105988,301.601013,126.300751zM301.796417,133.319016L301.395599,133.345963C299.740631,133.540878,298.142822,134.070938,296.699768,134.903717C295.098816,135.78006,293.62146,136.865036,292.306549,138.130219C291.264404,139.150299,290.465088,140.391296,289.96759,141.761612C289.36438,143.493225,289.630615,145.409592,290.682953,146.911621C291.859528,148.684113,293.91449,149.671082,296.034698,149.48201C297.567047,149.390991,299.06073,148.964966,300.410278,148.234055C302.207336,147.299255,303.861511,146.112946,305.322906,144.710876C306.284607,143.767151,307.052765,142.644867,307.584167,141.407135C308.377655,139.487228,308.077698,137.288376,306.798889,135.650696C305.90625,134.37352,304.502838,133.544434,302.952667,133.378418C302.570068,133.321472,302.182861,133.301575,301.796417,133.319016z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.52771,174.938004C330.907135,176.376419,331.109863,177.855667,331.131348,179.343048C331.140991,180.913391,330.788269,182.464722,330.100525,183.876755C329.284912,185.402817,327.990417,186.61911,326.415833,187.338638C324.171936,188.395706,321.654877,188.72998,319.212524,188.295227C317.964203,188.048447,316.787842,187.521973,315.772491,186.755524C314.332245,185.751999,313.161652,184.409088,312.364532,182.845856C311.819153,181.800247,311.407227,180.69043,311.138458,179.542328L310.207031,175.759995L300.801575,178.072845L299.023926,170.85611L327.780579,163.784363L330.52771,174.938004zM315.575714,174.43985L315.699463,174.941345C315.911407,175.872101,316.160706,176.794067,316.446716,177.704803C316.734985,178.68222,317.291321,179.559418,318.052795,180.237213C318.620514,180.667114,319.293762,180.936279,320.001617,181.016113C321.123322,181.060883,322.237854,180.828857,323.248352,180.340271C324.14624,179.851425,324.777618,178.986908,324.96933,177.983337C325.126617,177.021484,325.083862,176.037781,324.843781,175.09317C324.644379,174.164948,324.426147,173.241089,324.189056,172.321732L315.575714,174.43985z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M116.693192,163.543213L113.851212,171.179825L95.025467,169.25325L110.58651,179.953522L107.74453,187.590118L77.373581,184.299744L80.062973,177.072876L100.10704,180.173035L83.216843,168.597382L85.788689,161.686646L106.05442,164.191376L88.928635,153.248993L91.548454,146.207825L116.693192,163.543213z"/> </svg>`;


/* ═══════ FOOTER ICON (base64 PNG) ═══════ */

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xgAADEhJREFUeNrtmXtsVNedx7/n3Nfce2eu5+kZezx+MOMZO2PjOOAHBNdAbAR2Uchjo6br7YISqFiiRFrSKIrUAGLdpJtEVTdSkaJVUsRuVEVyE2GSUqALbDYP0WR5WCU2sbFj3MTYBgebuWPPzL1n/wCzxPEjJgmj1c5HOn/NOb97vt9zH7/fb4AMGTJkyJAhQ4YMGTL8f4R8F0FOnDgBURTJ5OQkALCampp06/r+eeutt2Cz2RCNRrPdbvdPNU3ba7PZXnW5XJtLSkp8kiThscceS/c2vx+OHTsGn8+HgoKCQlVVD1JKDQAMAKOUGrIsHwkEAkG73Y4XXngh3dudk1t6BO6++26Ew2HujTfeeFnX9a2Msa8GJQRWq/V3brf7X0zTZABAKQUhBBzHwTCMSZ7nvygtLb0Yj8fZoUOH0u3DwohGoygrKyuUJKkX109++qCUpnieHxcEYWzaGBcEYdRisZzyer0/AICDBw+mW9LCiEQiKC0tXSyK4shsBnyTYbVa31y9erW8ZMmStGnhbmVRfn4+JEkyLl261JRMJv0zzeF5flCSpKMcx3USQroEQThvtVr/SikdAJBlmqbFNM1cXdffGxoa6n3mmWdw9OjRtBmxIB555BEAgNvt/lue58cx7WR5no+53e4tr7/+Or3nnnv4UCjENzU1CY8//rj84IMPyna7/Z8JIQwAs9lsezdv3iysXLky3bIWxtKlS9HQ0CC4XK6tkiR18TyvcxwXkyTprMfj+emGDRvE+vr6r63zer0oKCioEAThrwCYIAiDeXl5d2VnZ6dFxy09AgDw+eefIxKJmGVlZR/ruv6WIAh/UFX13zwez6/Xrl17bHx83Jjp7V5TU4OHH3545P333w8lEomljDErpXRsZGTk8Icffoienp7basB3kgkuFLvdDlmWVwwPD+9PpVIOURR78vLy1iaTye4LFy58bf6KFStgs9m4c+fO+ePxeDiVShUCUE3THLZYLN1Op/PT1tbW0fb2drzyyivpkLQw7rzzTtTX10s2m+3fOY5jPM+bHo/nZwCwY8eOG/Nqa2tx77330kAgUKNp2iuiKHZzHBenlDJCCKOUGjzPfynL8gm73f50KBQKAMC2bdvSLXFuPvroI8iyjOLi4ny/3/83Lpfr4YKCgmWMMbJ7927s3LkTAFBSUpJtt9t3CYIwOPXSnG0QQkyLxXLK7XY379ixg6xevTrdMhfO8PAwQqEQlixZIhYWFq5yuVxtoiheJoSYuCnBEgRhRBCEIUEQhniev0wIMQkhSUEQRlVVPZebm/sQAKxfv37ea36jl2BLSwuWLVtGGGNWURSV6upq9PT0pHJzc3HgwIEFidy2bRueeuopDAwMqPF43BoIBMT6+vqk2+1mbW1t0sWLF9cMDAzsSiQSf+fz+XYxxg5PTEysY4xJAKAoyoVQKPQjURRfttvtr1JKP5yYmPghIaQvOzv7AdM0Px4fH3/W5/Od7OrqGmhtbcXhw4dv7UQ2bdoEl8uFwsLCfE3TfmmxWN4XBOG/FUV5x+12t9TU1Ejl5eULillUVIRgMOizWq1vchx3WlGUQyUlJYX5+fnIycmJiKI4AICpqvrpunXrsh0ORwXHcaNTd4Cqqr1VVVVLwuGwPxqN5ng8nrWU0nFCyEmO42wWi+VOSukVTdPeXLNmjbJ8+fI598PP9WN7eztsNltgcHDwXycnJxunip5kMonJycmVnZ2dRbW1tc/zPJ88efLkvOLz8/ORm5srdXV1rY7H442GYajJZPLLVCrlSCQSffF4XEilUtLU/OlFFgDE4/G8M2fO7GeMpa7PERlj1usGTa0zdV1v7OjoWKbr+p9uyYCGhgYcOXIEyWRy283ipzAMQ47FYv/4wQcfjMZisS6e5+kMYYjVav2yoaHho1OnTqUAuM6cOfMLXdd/ZBiGOiVS13XIsgyv16t0dnaK1xsrs0EAyABMACCEzKjBMAw1Ho83X7ly5U/bt2/HSy+9tDADxsbGUFVV5ezo6Gic6SQAIJVK2cfHx381tZnpMMY4XdePf/LJJ+u7u7tTdrt9aywW22ya5lfyD8MwYJomGGMU8+QmsiwPlJaW/kTX9Yscx5Hh4eHo0NDQXsYYmXZtJBKJOx544AGps7NzVkfprD9cq995QoiEOWCM8ddvw68NABzHcZzT6WTLly+XJiYm6qeLZ4zBNE2YpgnDMDCb2TcvSSQSMV3XRzs6Ojpjsdj52Q6AEKLFYjHBNM1Zg816B+Tk5KCuru5SV1fXx/F4PDqLSSmr1fqBKIqXkslkIhaL6YQQEEJAKQXHcdRms/0lGAymGGPs9OnTV2fZ6A0j5iMej+edPXv2gNVqPffQQw/d//bbb8/l2LxuzmrApk2b0NLSYjgcjt9MTEz8YHJysnD6pkVRfHvx4sWb33333cvd3d1s0aJF5vDwMHw+3415sVgMDQ0NaGlpgcfj+f3k5OSaVCql3Bxnqls01+lTSk1RFEcBmIwxieM4meO4+VL5kZycnMmRkZF5jZ2R++67D4wx+P3+1Yqi/CfHcZcJIaOCIAxpmrbP6/UGnE4ndu3aNW+s8vJyLFu2TPJ4PI/KstwxldzwPD8aCAQqCwoKEIlEakVRHMO0zyCl9Iqqqv01NTUrq6qqSqurq0vr6uoWMcaIzWarpJSO3fwZJISMEkKY3W7fDgBbtmy5NQMA4MUXXwQALF682OlwOCoEQbgrEAjcUVtbqwSDQRw/fvwbx3r22WcBAIsWLaoVBOESACaK4qWSkpKKYDCIcDhcKwjCGACmKEpvcXHxXXa7fS2ldFxV1e7GxsYcURT5rKysXJvNFrDb7XmapjVRSscppX/RNC2qKMo6QsiYIAj9gUCg1Ov1zrmn214NVlZWghCS1d/fv8UwjBJK6ZDD4XiREHJJFMXivr6+38bj8SoAhBAyCIAzDCNHVdXu+vr6Fe+9955L1/XfmaaZhWvPuGiapheAQSkdZIzxALxWq/W5K1eu/LyyspKdOnXqdstcOJs2bQJjDNFo1O1yuX4sy/J/UUpT+N8M8NPm5uZsq9VaQSm9kRnONFRVPRyJRHKKiormve4tN0S+Lffffz+i0agQDoe1aDRquXz5Mvnss89SdXV1eltbW0c4HN6fTCbHDcMoN01TFUXxclFR0at9fX22ZDK5kTFmmR6TEMJkWT7icDi2DQwMfPbcc8+hvb09XRJnp7GxEQDg9Xof1TTtpKZpp3Nzc38GAM8//zwAYNWqVdi6dSv1+/2rFEX5D5vN1lVYWFgty3IzpfQKvloKM0EQLmZlZf0yGAz6srKy8Nprr6Vb5uyEQiFEIhGPJEknADCO42Iej2e9IAhfSVn37dsHAKioqHD4/f573W73L1RV/aMoiv2U0s8lSepVFOW4w+H4p4KCgruam5u5+Yqf7xzGGJ5++mkMDQ2R8+fPE8bYnN/z3bt3AwDcbvdPKKVJXHvjH6murrZVVFTMuGaqT7hu3TqhrKzMEwgEgpqmFZeUlOTX1dWpBw4cQGtr6+0V/sQTT4DjOBQXF+c6nc5tmqa9pmnaPqfT+Q+hUMhjtVpnbE2Vl5ejqqrKpijKIVxrcCRdLtdGAHjyySdvr4hbZc+ePfB4PMjPzy9WFOUYpfTmjo2hKMrBoqKikMfjwdmzZ2+sO378OGRZhs/na+Y4LgaAWSyWP4fD4exgMJgWLbeUB1RWVsLv9/NHjx7do+v6ozP9Oaqq6pt5eXkvM8ZM4NqjYhgGrl69yo2NjW2Px+NNlFKWlZW1fXR09FdNTU145513/m8YEIlEQCkt6unpOZZIJPJnmkMpNTmO+1oZapomMU1TYowRURTP+f3+tYZh9Pb399928cAc5fCcrl0rYBRca0zMiGmaNJlMytOHYRgWxhghhDBRFF/v7e3tLSsrS4t4YJ6W2GxwHAdCyBeU0j4AnpnmCIIwKEnSGdxUklJKQSlliUTiqiAIHVlZWb9RVTUtt/63MmDp0qXYu3fvZafTuSeZTN4x1d66yaCYpmk/37lz529PnjxJGWOglEJVVXi9XiiKYmzcuNGIxWLIy8tLm3jgWxRDPp8PsiwLY2Njfx+LxR43DKMAAOE4blCW5Zc8Hs+ruq4nBwYG0irwezMAADZs2IDS0lLS1tbmNU0zQCmlkiR9UV1dfWF4eJjt378/3foyZMiQIUOGDBkyZMiQIcNM/A+SuM25qDqHNQAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAAElFTkSuQmCC';
/* ═══════ LIGHT THEMES LIST ═══════ */

const LIGHT_THEMES = ['riad', 'medina'];

/* ═══════ APP VERSION ═══════ */

const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

// ── Shared i18n keys (template) ──
const LANG_BASE = {
  en: {
    copied:'Copied!',
    demoNext:'Next',
    demoPause:'Pause',
    demoPlay:'Play',
    demoPrev:'Prev',
    learnAge:'Ages:',
    learnLevel:'Level:',
    learnTime:'Time:',
    logCleared:'Log cleared',
    sectionCode:'Device Code',
    sectionDemo:'Watch Demo',
    sectionLearn:'What You Shall Learn',
    splashHint:'tap to skip'
  },
  fr: {
    copied:'Copié !',
    demoNext:'Suiv',
    demoPause:'Pause',
    demoPlay:'Jouer',
    demoPrev:'Préc',
    learnAge:'Âge :',
    learnLevel:'Niveau :',
    learnTime:'Durée :',
    logCleared:'Journal effacé',
    sectionCode:'Code Appareil',
    sectionDemo:'Voir la Démo',
    sectionLearn:'Ce que tu vas apprendre',
    splashHint:'appuyer pour passer'
  },
  ar: {
    copied:'تم النسخ!',
    demoNext:'التالي',
    demoPause:'إيقاف',
    demoPlay:'تشغيل',
    demoPrev:'السابق',
    learnAge:'العمر:',
    learnLevel:'المستوى:',
    learnTime:'المدة:',
    logCleared:'تم مسح السجل',
    sectionCode:'كود الجهاز',
    sectionDemo:'شاهد العرض',
    sectionLearn:'ماذا ستتعلم',
    splashHint:'انقر للتخطي'
  }
};

const LANG = {
  en: {
    ...LANG_BASE.en,
    title: 'Fox Hunt Compass', subtitle: '🦊 hunt · 📡 find · 🎯 locate',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Fox Hunt — Transmitter Finder', mainDesc: 'Find the hidden radio transmitter',
    sectionA: 'How It Works', sectionB: 'Lab', sectionC: 'Challenge',
    signalStrength: 'Signal Strength',
    directionLabel: 'Direction', distanceLabel: 'Distance',
    stepsLabel: 'Steps', bearingLabel: 'Bearing',
    moveN: 'N', moveS: 'S', moveE: 'E', moveW: 'W',
    newHunt: 'New Hunt',
    foxFound: '🦊 Fox found in {n} steps!',
    huntStarted: '📡 New hunt started — find the fox!',
    signalWeak: 'Weak', signalMedium: 'Medium', signalStrong: 'Strong', signalVeryStrong: 'Very Strong',
    distFar: 'Far', distMedium: 'Medium', distClose: 'Close', distVeryClose: 'Very Close',
    howworks_1: 'The fox (hidden transmitter) broadcasts a periodic radio beacon signal at a known frequency.',
    howworks_2: 'The hunter uses a directional antenna or signal strength meter to measure the received signal.',
    howworks_3: 'Move toward the direction where the signal is strongest — the signal follows the inverse square law.',
    howworks_4: 'Triangulate from multiple readings to pinpoint the exact location of the hidden transmitter.',
    lab_1: 'Multiple foxes can be placed on the field simultaneously — each transmits on a different frequency.',
    lab_2: 'Use the body-shielding technique: rotate your body to attenuate the signal and find the direction of strongest reception.',
    lab_3: 'Log signal readings at different positions to build a signal map of the area.',
    lab_4: 'Triangulate from at least 3 measurement points to calculate the fox\'s precise coordinates.',
    challenge1_title: 'Challenge 1: Speed Hunter',
    challenge1_desc: 'Find the fox in under 20 steps. Use signal gradient and bearing to optimize your path.',
    challenge2_title: 'Challenge 2: Triple Fox',
    challenge2_desc: 'Find 3 foxes hidden in the same field in a single hunt session. Each fox reveals the next.',
    challenge3_title: 'Challenge 3: Moving Fox',
    challenge3_desc: 'Find a fox that changes position every 5 steps. Requires fast triangulation and prediction.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    helpSettings: '❓ Help & Settings', settingsTab: '⚙️',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'The main display shows the Fox Hunt Compass simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Select the operating band and tune to the target frequency.',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_foxhunt_title: '🦊 Fox Hunting',
    wiki_foxhunt: 'Transmitter hunting (fox hunting / ARDF) is a competitive sport where participants use radio direction finding to locate hidden transmitters in an outdoor area.',
    wiki_df_title: '🧭 Direction Finding',
    wiki_df: 'Radio direction finding uses directional antennas (Yagi, loop, Adcock) to determine the bearing toward a signal source by rotating for maximum or null signal.',
    wiki_atten_title: '📉 Signal Attenuation',
    wiki_atten: 'Signal strength decreases with distance following the inverse square law. Obstacles like buildings and terrain cause additional attenuation and multipath effects.',
    wiki_tri_title: '📐 Triangulation',
    wiki_tri: 'Triangulation uses bearing measurements from two or more known positions to calculate the location of an unknown signal source by finding where the bearing lines intersect.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🦊 Fox Hunt Compass ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    export: 'Export', filterAll: 'All',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', chatPlaceholder: 'Talk to the robot...',
    splashHint: 'tap to skip',
    newVersion: 'UPDATE',
    langChanged: '🌐 Language → English',
    themeChanged: '🎨 Theme →',step1Title:'Tune Frequency',step1Desc:'Select the operating band and tune to the target frequency.',step2Title:'Transmit/Receive',step2Desc:'Send or receive radio signals using the chosen modulation mode.',step3Title:'Decode Signal',step3Desc:'The received signal is processed and decoded into readable data.',step4Title:'Log Contact',step4Desc:'Record the contact details: callsign, frequency, mode, and signal report.',sectionCode:'Device Code',faq_q1:'What is Fox Hunt Compass?',faq_a1:'Fox Hunt Compass is an interactive simulation that demonstrates LoRa networks concepts. Find the hidden radio transmitter. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real amateur radio behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real amateur radio principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + micro:bit. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bit Cw Paddle and Bit Satellite Alarm. Each app in this category teaches a different aspect of amateur radio.',demo_s1:'Welcome to Fox Hunt Compass! Look at the main display — this is where the amateur radio simulation runs.',demo_s2:'Press "New Hunt" to hide a fox at a random location on the field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of amateur radio.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Radio Bands',learn1Desc:'How different frequencies carry different signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Radio',learn2Title:'Digital Modes',learn2Desc:'How computers encode messages into radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Digital',learn3Title:'Propagation',learn3Desc:'How radio waves bounce off the atmosphere to travel far. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Physics',learn4Title:'QSO Logging',learn4Desc:'How ham operators record contacts around the world. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Communication',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Fox Hunt Compass! This is like a science experiment on your computer. You get to control a real LoRa networks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Select the operating band and tune to the target f Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches amateur radio concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n    msg = radio.receive()\\n    if msg:\\n        display.scroll(msg)\\n    if button_a.was_pressed():\\n        radio.send("HELLO")\\n        display.show(Image.YES)',codeExplain:'This code turns on the micro:bit radio on group 42 at full power. When button A is pressed, it broadcasts "HELLO". Any received message scrolls across the LED display. Group numbers act like channels — only micro:bits on the same group hear each other.',purpose:'Fox Hunt Compass: Find the hidden radio transmitter. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Tune Frequency through Transmit/Receive to Decode Signal and Log Contact.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Lora Networks',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Fox Hunt Compass builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Fox Hunt Compass',
    wiki_math: 'The mathematics behind Fox Hunt Compass: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced LoRa networks practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to LoRa networks. Hardware-based solutions using LoRa module offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with LoRa networks: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in LoRa networks.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Lora Networks carries important ethical and legal responsibilities. Many countries regulate the use of LoRa module and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Hertz (Hz)',
    gloss4_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Fox Hunt Compass demonstrates key principles from LoRa networks. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world LoRa networks?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional LoRa networks systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use LoRa module hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Fox Hunt Compass', subtitle: '🦊 chasse · 📡 trouve · 🎯 localise',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Chasse au Renard — Chercheur d\'emetteur', mainDesc: 'Trouvez l\'emetteur radio cache',
    sectionA: 'Comment ca marche', sectionB: 'Labo', sectionC: 'Defi',
    signalStrength: 'Puissance du signal',
    directionLabel: 'Direction', distanceLabel: 'Distance',
    stepsLabel: 'Pas', bearingLabel: 'Cap',
    moveN: 'N', moveS: 'S', moveE: 'E', moveW: 'O',
    newHunt: 'Nouvelle chasse',
    foxFound: '🦊 Renard trouve en {n} pas !',
    huntStarted: '📡 Nouvelle chasse lancee — trouvez le renard !',
    signalWeak: 'Faible', signalMedium: 'Moyen', signalStrong: 'Fort', signalVeryStrong: 'Tres fort',
    distFar: 'Loin', distMedium: 'Moyen', distClose: 'Proche', distVeryClose: 'Tres proche',
    howworks_1: 'Le renard (emetteur cache) diffuse un signal radio periodique sur une frequence connue.',
    howworks_2: 'Le chasseur utilise une antenne directionnelle ou un mesureur de signal pour mesurer la reception.',
    howworks_3: 'Deplacez-vous vers la direction ou le signal est le plus fort — le signal suit la loi de l\'inverse du carre.',
    howworks_4: 'Triangulez a partir de plusieurs mesures pour localiser precisement l\'emetteur cache.',
    lab_1: 'Plusieurs renards peuvent etre places simultanement sur le terrain — chacun emet sur une frequence differente.',
    lab_2: 'Utilisez la technique d\'ecran corporel : tournez votre corps pour attenuer le signal et trouver la direction de reception maximale.',
    lab_3: 'Enregistrez les mesures de signal a differentes positions pour cartographier la zone.',
    lab_4: 'Triangulez a partir d\'au moins 3 points de mesure pour calculer les coordonnees exactes du renard.',
    challenge1_title: 'Defi 1 : Chasseur rapide',
    challenge1_desc: 'Trouvez le renard en moins de 20 pas. Utilisez le gradient de signal et le cap pour optimiser votre chemin.',
    challenge2_title: 'Defi 2 : Triple renard',
    challenge2_desc: 'Trouvez 3 renards caches dans le meme terrain en une seule session. Chaque renard revele le suivant.',
    challenge3_title: 'Defi 3 : Renard mobile',
    challenge3_desc: 'Trouvez un renard qui change de position tous les 5 pas. Necessite une triangulation rapide et de la prediction.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Theme',
    settings: '⚙️ Parametres', language: 'Langue',
    helpSettings: '❓ Aide & Parametres', settingsTab: '⚙️',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'L écran principal affiche la simulation Fox Hunt Compass. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Select the operating band and tune to the target frequency.',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_foxhunt_title: '🦊 Chasse au renard',
    wiki_foxhunt: 'La chasse a l\'emetteur (chasse au renard / ARDF) est un sport competitif ou les participants utilisent la radiogoniometrie pour localiser des emetteurs caches en plein air.',
    wiki_df_title: '🧭 Radiogoniometrie',
    wiki_df: 'La radiogoniometrie utilise des antennes directionnelles (Yagi, boucle, Adcock) pour determiner le relevement vers une source de signal en tournant pour le maximum ou le nul du signal.',
    wiki_atten_title: '📉 Attenuation du signal',
    wiki_atten: 'La puissance du signal diminue avec la distance selon la loi de l\'inverse du carre. Les obstacles comme les batiments et le terrain causent une attenuation et des effets de trajet multiples supplementaires.',
    wiki_tri_title: '📐 Triangulation',
    wiki_tri: 'La triangulation utilise des mesures de relevement depuis deux ou plusieurs positions connues pour calculer l\'emplacement d\'une source de signal inconnue en trouvant l\'intersection des lignes de relevement.',
    working: 'En cours…',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🦊 Boussole Chasse au Renard prete !',
    logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    export: 'Exporter', filterAll: 'Tout',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', chatPlaceholder: 'Parle au robot...',
    splashHint: 'appuyer pour passer',
    newVersion: 'MAJ',
    langChanged: '🌐 Langue → Francais',
    themeChanged: '🎨 Theme →',step1Title:'Régler la fréquence',step1Desc:'Sélectionne la bande et règle la fréquence cible.',step2Title:'Émettre/Recevoir',step2Desc:'Envoie ou reçois des signaux radio avec le mode de modulation choisi.',step3Title:'Décoder le signal',step3Desc:'Le signal reçu est traité et décodé en données lisibles.',step4Title:'Enregistrer le contact',step4Desc:'Note les détails : indicatif, fréquence, mode et rapport de signal.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Fox Hunt Compass ?',faq_a1:'Fox Hunt Compass est une simulation interactive qui démontre les concepts de réseaux LoRa. Find the hidden radio transmitter. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de radio amateur. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de radio amateur. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + micro:bit. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de radio amateur.',demo_s1:'Bienvenue dans Fox Hunt Compass ! Regarde l\'écran principal — c\'est ici que la simulation de radio amateur fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de radio amateur.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Radio Bands',learn1Desc:'How different frequencies carry different signals. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Radio',learn2Title:'Digital Modes',learn2Desc:'How computers encode messages into radio signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Digital',learn3Title:'Propagation',learn3Desc:'How radio waves bounce off the atmosphere to travel far. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Physics',learn4Title:'QSO Logging',learn4Desc:'How ham operators record contacts around the world. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Communication',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Fox Hunt Compass ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de réseaux LoRa — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Select the operating band and tune to the target f Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de radio amateur par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n    msg = radio.receive()\\n    if msg:\\n        display.scroll(msg)\\n    if button_a.was_pressed():\\n        radio.send("HELLO")\\n        display.show(Image.YES)',codeExplain:'Ce code active la radio du micro:bit sur le groupe 42 à pleine puissance. Quand le bouton A est pressé, il diffuse "HELLO". Tout message reçu défile sur l\'écran LED. Les numéros de groupe fonctionnent comme des canaux.',purpose:'Fox Hunt Compass : Find the hidden radio transmitter. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de réseaux LoRa',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. Fox Hunt Compass s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Fox Hunt Compass',
    wiki_math: 'Les mathématiques derrière Fox Hunt Compass : BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de réseaux LoRa utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour réseaux LoRa. Les solutions matérielles avec LoRa module offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en réseaux LoRa : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Réseaux lora implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de LoRa module. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Hertz (Hz)',
    gloss4_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Fox Hunt Compass démontre les principes clés de réseaux LoRa. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec LoRa networks dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel LoRa module et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'بوصلة صيد الثعلب', subtitle: '🦊 صيد · 📡 بحث · 🎯 تحديد',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'صيد الثعلب — باحث الارسال', mainDesc: 'اعثر على جهاز الارسال اللاسلكي المخفي',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    signalStrength: 'قوة الاشارة',
    directionLabel: 'الاتجاه', distanceLabel: 'المسافة',
    stepsLabel: 'الخطوات', bearingLabel: 'الاتجاه',
    moveN: 'ش', moveS: 'ج', moveE: 'شر', moveW: 'غ',
    newHunt: 'صيد جديد',
    foxFound: '🦊 تم العثور على الثعلب في {n} خطوة!',
    huntStarted: '📡 بدأ صيد جديد — اعثر على الثعلب!',
    signalWeak: 'ضعيف', signalMedium: 'متوسط', signalStrong: 'قوي', signalVeryStrong: 'قوي جدا',
    distFar: 'بعيد', distMedium: 'متوسط', distClose: 'قريب', distVeryClose: 'قريب جدا',
    howworks_1: 'يبث الثعلب (جهاز الارسال المخفي) اشارة راديو دورية على تردد معروف.',
    howworks_2: 'يستخدم الصياد هوائيا اتجاهيا او مقياس قوة الاشارة لقياس الاشارة المستقبلة.',
    howworks_3: 'تحرك نحو الاتجاه الذي تكون فيه الاشارة اقوى — تتبع الاشارة قانون التربيع العكسي.',
    howworks_4: 'قم بالتثليث من عدة قراءات لتحديد الموقع الدقيق لجهاز الارسال المخفي.',
    lab_1: 'يمكن وضع عدة ثعالب على الميدان في نفس الوقت — كل منها يرسل على تردد مختلف.',
    lab_2: 'استخدم تقنية حجب الجسم: ادر جسمك لاضعاف الاشارة وايجاد اتجاه الاستقبال الاقوى.',
    lab_3: 'سجل قراءات الاشارة في مواقع مختلفة لبناء خريطة اشارة للمنطقة.',
    lab_4: 'قم بالتثليث من 3 نقاط قياس على الاقل لحساب الاحداثيات الدقيقة للثعلب.',
    challenge1_title: 'التحدي 1: الصياد السريع',
    challenge1_desc: 'اعثر على الثعلب في اقل من 20 خطوة. استخدم تدرج الاشارة والاتجاه لتحسين مسارك.',
    challenge2_title: 'التحدي 2: الثعلب الثلاثي',
    challenge2_desc: 'اعثر على 3 ثعالب مخفية في نفس الميدان في جلسة صيد واحدة. كل ثعلب يكشف التالي.',
    challenge3_title: 'التحدي 3: الثعلب المتحرك',
    challenge3_desc: 'اعثر على ثعلب يغير موقعه كل 5 خطوات. يتطلب تثليثا سريعا وتنبؤا.',
    activityLog: 'سجل النشاط', eventsMsg: 'الاحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
    settings: '⚙️ الاعدادات', language: 'اللغة',
    helpSettings: '❓ مساعدة واعدادات', settingsTab: '⚙️',
    help: '❓ مساعدة', faq: 'اسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Fox Hunt Compass. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Select the operating band and tune to the target frequency.',
    howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
    howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_foxhunt_title: '🦊 صيد الثعلب',
    wiki_foxhunt: 'صيد الارسال (صيد الثعلب / ARDF) هو رياضة تنافسية يستخدم فيها المشاركون تحديد الاتجاه اللاسلكي لتحديد موقع اجهزة ارسال مخفية في منطقة مفتوحة.',
    wiki_df_title: '🧭 تحديد الاتجاه',
    wiki_df: 'يستخدم تحديد الاتجاه اللاسلكي هوائيات اتجاهية (ياغي، حلقة، ادكوك) لتحديد الاتجاه نحو مصدر الاشارة عن طريق الدوران للحصول على الحد الاقصى او الصفر للاشارة.',
    wiki_atten_title: '📉 اضمحلال الاشارة',
    wiki_atten: 'تتناقص قوة الاشارة مع المسافة وفقا لقانون التربيع العكسي. العوائق مثل المباني والتضاريس تسبب اضمحلالا اضافيا وتأثيرات المسار المتعدد.',
    wiki_tri_title: '📐 التثليث',
    wiki_tri: 'يستخدم التثليث قياسات الاتجاه من موقعين معروفين او اكثر لحساب موقع مصدر اشارة غير معروف من خلال ايجاد نقطة تقاطع خطوط الاتجاه.',
    working: 'جار…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'اندلس',
    t_riad: 'رياض', t_medina: 'مدينة',
    t_space: 'فضاء', t_jungle: 'ادغال', t_robot: 'روبوت',
    ready: '🦊 بوصلة صيد الثعلب جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    export: 'تصدير', filterAll: 'الكل',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', chatPlaceholder: 'تحدث مع الروبوت...',
    splashHint: 'انقر للتخطي',
    newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية',
    themeChanged: '🎨 المظهر ←',step1Title:'ضبط التردد',step1Desc:'اختر نطاق التشغيل واضبط التردد المستهدف.',step2Title:'إرسال/استقبال',step2Desc:'أرسل أو استقبل إشارات الراديو باستخدام وضع التعديل المختار.',step3Title:'فك تشفير الإشارة',step3Desc:'تتم معالجة الإشارة المستقبلة وفك تشفيرها إلى بيانات مقروءة.',step4Title:'تسجيل الاتصال',step4Desc:'سجّل تفاصيل الاتصال: إشارة النداء والتردد والوضع وتقرير الإشارة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Fox Hunt Compass؟',faq_a1:'Fox Hunt Compass هي محاكاة تفاعلية توضح مفاهيم شبكات لورا. Find the hidden radio transmitter. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الراديو الهاوي. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الراديو الهاوي. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + micro:bit. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الراديو الهاوي.',demo_s1:'مرحباً في Fox Hunt Compass! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الراديو الهاوي.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالراديو الهاوي.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Radio Bands',learn1Desc:'How different frequencies carry different signals. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Radio',learn2Title:'Digital Modes',learn2Desc:'How computers encode messages into radio signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Digital',learn3Title:'Propagation',learn3Desc:'How radio waves bounce off the atmosphere to travel far. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Physics',learn4Title:'QSO Logging',learn4Desc:'How ham operators record contacts around the world. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Communication',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Fox Hunt Compass! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـشبكات لورا — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Select the operating band and tune to the target f لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الراديو الهاوي من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'MicroPython (micro:bit)',codeSnippet:'from microbit import *\\nimport radio\\n\\nradio.on()\\nradio.config(group=42, power=7)\\n\\nwhile True:\\n    msg = radio.receive()\\n    if msg:\\n        display.scroll(msg)\\n    if button_a.was_pressed():\\n        radio.send("HELLO")\\n        display.show(Image.YES)',codeExplain:'يشغّل هذا الكود راديو micro:bit على المجموعة 42 بأقصى طاقة. عند الضغط على الزر A يبث "HELLO". أي رسالة مستلمة تمرر على شاشة LED.',purpose:'Fox Hunt Compass: Find the hidden radio transmitter. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ شبكات لورا',
    wiki_history: 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors. يبني Fox Hunt Compass على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Fox Hunt Compass',
    wiki_math: 'الرياضيات وراء Fox Hunt Compass: BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency. The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو شبكات لورا المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في شبكات لورا. توفر الحلول المادية باستخدام LoRa module أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في شبكات لورا: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'شبكات لورا يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام LoRa module والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Advertising Packet',
    gloss1_def: 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    gloss2_term: 'Bandwidth',
    gloss2_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Hertz (Hz)',
    gloss4_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Fox Hunt Compass يوضح المبادئ الأساسية في شبكات لورا. Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـLoRa networks في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة LoRa module وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  // Toggle shared .light-theme class
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;

  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }

  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
  logWithHistory(msg, type);
  applyLogFilter();
  resetPetSleep();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) {
    toastTimer = setTimeout(hideToast, autoHideMs);
  }
}

function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}

function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter();
      playSound('click');
    });
  });
}

function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      // Show update badge on settings button
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

// Call this from your deployment/CI to set latest version:
// localStorage.setItem('wdiy-latest-version', '1.3');

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY); // triggers storage event on other tabs
  } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try {
      const msg = JSON.parse(e.newValue);
      callback(msg);
    } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        activateRetroTheme();
      }
    } else {
      konamiIdx = 0;
    }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('🕹️ KONAMI CODE ACTIVATED — RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth; // force reflow
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, '')); // strip timestamp
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') {
      await sleep(400);
      continue;
    } else if (ch === ' ') {
      await sleep(200);
      continue;
    }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;

const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('🔴 Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('🟢 Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) {
      logoClickCount = 0;
      toggleMatrix();
    } else {
      logoClickTimer = setTimeout(() => logoClickCount = 0, 500);
    }
  });
}

/* ═══════ DEBUG PANEL (FPS + MEMORY) ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();

  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) {
        memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      }
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  log('🐛 Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  const THRESHOLD = 25;

  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > THRESHOLD && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    viewport: `${innerWidth}x${innerHeight}`,
    theme: document.documentElement.dataset.theme,
    lang: currentLang,
    log: lines.slice(-50) // last 50 entries
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bug-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  log('📱 Bug report exported (shake)', 'success');
  playSound('success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

const logHistory = [];

function logWithHistory(msg, type) {
  logHistory.push({ msg, type, ts: Date.now() });
}

// Time-travel: Ctrl+Z in log panel undoes last log entry
function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ TYPEWRITER LOG MODE ═══════ */

let typewriterEnabled = true;

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  // Approximate Hijri conversion (Kuwaiti algorithm)
  const d = new Date();
  const jd = Math.floor((11 * d.getFullYear() + 3) / 30) + 354 * d.getFullYear() +
    30 * Math.floor((d.getMonth() + 1 - 1) / 2) + Math.floor(d.getDate() / 2) - 385;

  // Use Intl if available (much more accurate)
  try {
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
    return hijri;
  } catch {
    return '';
  }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
}

/* ═══════ WHISPER MODE (Voice-to-Log) ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('🎤 Speech not supported in this browser', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('🎤 Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';

  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log(`🎤 ${text}`, 'rx');
      }
    }
  };
  recognition.onerror = e => log(`🎤 Error: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };

  recognition.start();
  whisperActive = true;
  log('🎤 Whisper mode on — speak!', 'success');
}

/* ═══════ GHOST USERS (cross-tab cursors) ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth;
  ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth;
    ghostCanvas.height = innerHeight;
  });

  // Broadcast my cursor
  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({
        id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now()
      }));
    } catch {}
  });

  // Listen for other cursors
  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  // Render ghosts
  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent;
      ghostCtx.fill();
      // tiny trail
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff';
      ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],    // E4 G4 C5 — majestic
  'zellige':     [440, 523, 659],    // A4 C5 E5 — bright
  'andalus':     [294, 370, 440],    // D4 F#4 A4 — warm
  'space':       [523, 659, 784],    // C5 E5 G5 — dreamy
  'jungle':      [262, 330, 392],    // C4 E4 G4 — earthy
  'robot':       [440, 554, 659],    // A4 C#5 E5 — techy
  'riad':        [349, 440, 523],    // F4 A4 C5 — serene
  'medina':      [294, 349, 440],    // D4 F4 A4 — calm
  'retro':       [523, 262, 523],    // C5 C4 C5 — retro beep
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15);
    osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;

  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('🫁 Breathing guide on — inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log(`📿 Dhikr count: ${dhikrCount}`, 'success');
    dhikrCount = 0;
    log('🫁 Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ PIXEL PET (Animated Logo) ═══════ */

const PET_STATES = {
  idle:    { class: 'pet-idle', duration: 0 },
  happy:   { class: 'pet-happy', duration: 3000 },
  sad:     { class: 'pet-sad', duration: 3000 },
  sleep:   { class: 'pet-sleep', duration: 0 },
};

let petState = 'idle';
let petFrame = 0;
let petTimer = null;
let petIdleTimer = null;

function initPixelPet() {
  const pet = document.createElement('div');
  pet.id = 'pixelPet';
  pet.className = 'pixel-pet pet-idle';
  pet.title = 'Click me!';
  pet.innerHTML = `<img src="${FOOTER_ICON}" alt="Bot" />`;
  pet.addEventListener('click', () => {
    setPetState('happy');
    playSound('success');
  });
  const footer = document.querySelector('.app-footer');
  if (footer) footer.insertBefore(pet, footer.firstChild);
}

function setPetState(state) {
  petState = state;
  const pet = $('pixelPet');
  if (!pet) return;
  // Remove all state classes
  pet.classList.remove('pet-idle', 'pet-happy', 'pet-sad', 'pet-sleep');
  pet.classList.add(PET_STATES[state].class);
  // Auto-return to idle
  if (petIdleTimer) clearTimeout(petIdleTimer);
  const dur = PET_STATES[state].duration;
  if (dur > 0) {
    petIdleTimer = setTimeout(() => setPetState('idle'), dur);
  }
}

// Pet goes to sleep after 60s of no log activity
let petSleepTimer = null;
function resetPetSleep() {
  if (petSleepTimer) clearTimeout(petSleepTimer);
  if (petState === 'sleep') setPetState('idle');
  petSleepTimer = setTimeout(() => setPetState('sleep'), 60000);
}

/* ═══════ NIGHT MODE (sunset auto-detect) ═══════ */

function initNightMode() {
  // Calculate approximate sunset using date + rough estimate
  // More accurate with geolocation, but works without it
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;

  if (isNight) {
    // Only auto-apply if user hasn't manually set a theme
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) {
        setTheme('mosque-gold'); // calm dark theme
        log('🌙 Night mode — time to rest', 'info');
      }
    } catch {}
  }

  // Try geolocation for more precise sunset
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const sunset = calcSunset(pos.coords.latitude, pos.coords.longitude);
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      if (nowMins >= sunset || nowMins < 360) { // after sunset or before 6am
        try {
          const manual = localStorage.getItem('wdiy-theme');
          if (!manual) {
            setTheme('mosque-gold');
            log('🌙 Night detected — sweet dreams', 'info');
          }
        } catch {}
      }
    }, () => {}, { timeout: 3000 });
  }
}

function calcSunset(lat, lng) {
  // Simplified sunset calculation (returns minutes since midnight)
  const d = new Date();
  const N = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const radLat = lat * Math.PI / 180;
  const decl = -23.45 * Math.cos(2 * Math.PI / 365 * (N + 10)) * Math.PI / 180;
  const ha = Math.acos(-Math.tan(radLat) * Math.tan(decl)) * 180 / Math.PI;
  const sunset = 720 + (ha * 4) - (lng * 4) + (d.getTimezoneOffset());
  return Math.round(sunset);
}

/* ═══════ LOGO FOLLOWS CURSOR (magnetic eyes) ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;
  
  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    
    const tiltX = dy * 8;  // max 8deg
    const tiltY = -dx * 8;
    const shift = dist * 4; // max 4px shift
    
    logo.style.transform = `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dx * shift}px) translateY(${dy * shift}px)`;
  });
  
  // Pupil dilate on click
  logo.addEventListener('mousedown', () => {
    logo.style.transition = 'transform .1s';
    logo.style.transform += ' scale(1.15)';
    setTimeout(() => { logo.style.transition = ''; }, 150);
  });
  logo.addEventListener('mouseup', () => {
    logo.style.transition = 'transform .2s';
    setTimeout(() => { logo.style.transition = ''; }, 200);
  });
  
  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE (live audio visualizer) ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => {
      b.style.height = ''; b.style.opacity = ''; b.style.background = '';
    });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('🎵 Music mode off', 'info');
    return;
  }
  
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);
    
    musicActive = true;
    log('🎵 Music mode on — play some music!', 'success');
    
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    const root = document.documentElement;
    
    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      
      // Average bass (0-10), mid (10-50), treble (50+)
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const mid = data.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      
      // Deco bands = live equalizer
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      
      // Cards pulse to bass
      cards.forEach(c => {
        c.style.transform = `scale(${1 + bass * 0.015})`;
        c.style.transition = 'transform 0.05s';
      });
      
      // Hue shift with frequency
      const hue = Math.round(mid * 60);
      root.style.filter = `hue-rotate(${hue}deg)`;
      
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => {
    log('🎵 Microphone access denied', 'error');
  });
}

/* ═══════ AR MODE (WebXR overlay) ═══════ */

function initAR() {
  // Check WebXR support
  if (!navigator.xr) return;
  
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    if (!supported) return;
    
    // Add AR button to header
    const btns = document.querySelector('.header-buttons');
    if (!btns) return;
    const arBtn = document.createElement('button');
    arBtn.className = 'btn-icon-only';
    arBtn.setAttribute('aria-label', 'AR Mode');
    arBtn.textContent = '📷';
    arBtn.onclick = startAR;
    btns.appendChild(arBtn);
    log('📷 AR mode available!', 'info');
  }).catch(() => {});
}

async function startAR() {
  try {
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.querySelector('.app') }
    });
    log('📷 AR session started!', 'success');
    
    session.addEventListener('end', () => {
      log('📷 AR session ended', 'info');
    });
  } catch (e) {
    log(`📷 AR failed: ${e.message}`, 'error');
  }
}

/* ═══════ AI CHAT (app talks back) ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  const s = LANG[currentLang];
  chatHistory.push({ role: 'user', content: userMsg });
  
  log(`💬 You: ${userMsg}`, 'tx');
  
  try {
    const systemPrompt = `You are the Workshop-DIY robot assistant embedded in a kids educational app. You are geeky, funny (clean humor), and helpful. Keep responses SHORT (1-2 sentences max). Current language: ${currentLang}. Current theme: ${document.documentElement.dataset.theme}. You know about MQTT, IoT, ESP32, micro:bit, and coding. You respect Islamic values. Never be mean. Be encouraging. Add relevant emojis.`;
    
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: systemPrompt,
        messages: chatHistory.slice(-10) // keep context short
      })
    });
    
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '🤖 ...';
    chatHistory.push({ role: 'assistant', content: reply });
    log(`🤖 ${reply}`, 'rx');
    playSound('success');
    setPetState('happy');
  } catch (e) {
    log('🤖 Brain offline — check connection', 'error');
    setPetState('sad');
  }
}

function initAIChat() {
  // Add chat input to log panel footer
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = `
    <input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." data-i18n-placeholder="chatPlaceholder" />
    <button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">🤖</span></button>
  `;
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  
  const input = $('chatInput');
  const sendBtn = $('chatSendBtn');
  
  const send = () => {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    aiRespond(msg);
  };
  
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter') send();
  });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;

  let dragging = false;
  let startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  // Touch support
  handle.addEventListener('touchstart', e => {
    dragging = true;
    startX = e.touches[0].clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  // Restore saved width
  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) {
    const first = sb.querySelector(FOCUSABLE);
    if (first) first.focus();
  }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;

function openSettings() {
  // If log is docked, remember and close it temporarily
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}
function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  // Restore log if it was open before
  if (logWasOpen) { openLog(); logWasOpen = false; }
}
function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}
function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}

function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}

function closeAllPanels() {
  closeHelp();
  closeSettings();
  closeLog();
}

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
    return;
  }
}

/* ═══════ FOX HUNT SIMULATION ═══════ */

const GRID_SIZE = 20;         // 20x20 grid
const FIND_THRESHOLD = 1.5;   // cells distance to find the fox
const NOISE_FACTOR = 0.15;    // signal noise amount

let foxX = 0, foxY = 0;
let playerX = 0, playerY = 0;
let prevPlayerX = 0, prevPlayerY = 0;
let stepCount = 0;
let huntActive = false;
let foxFoundFlag = false;
let fieldCanvas, fieldCtx;

function initFoxHunt() {
  fieldCanvas = $('fieldCanvas');
  if (!fieldCanvas) return;
  fieldCtx = fieldCanvas.getContext('2d');

  // Size canvas properly
  resizeFieldCanvas();
  window.addEventListener('resize', resizeFieldCanvas);

  // Move buttons
  const mN = $('moveN'), mS = $('moveS'), mE = $('moveE'), mW = $('moveW');
  if (mN) mN.onclick = () => movePlayer(0, -1);
  if (mS) mS.onclick = () => movePlayer(0, 1);
  if (mE) mE.onclick = () => movePlayer(1, 0);
  if (mW) mW.onclick = () => movePlayer(-1, 0);

  // Keyboard controls
  document.addEventListener('keydown', e => {
    if (!huntActive || foxFoundFlag) return;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); e.preventDefault(); break;
      case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); e.preventDefault(); break;
      case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); e.preventDefault(); break;
    }
  });

  // New hunt button
  const nhBtn = $('newHuntBtn');
  if (nhBtn) nhBtn.onclick = startNewHunt;

  // Start first hunt
  startNewHunt();
}

function resizeFieldCanvas() {
  if (!fieldCanvas) return;
  const wrap = fieldCanvas.parentElement;
  if (!wrap) return;
  const w = wrap.clientWidth;
  fieldCanvas.width = w;
  fieldCanvas.height = 350;
  drawField();
}

function startNewHunt() {
  // Remove old overlay
  const wrap = $('canvasWrap');
  if (wrap) {
    const old = wrap.querySelector('.fox-found-overlay');
    if (old) old.remove();
  }

  // Random fox position (not at edges)
  foxX = 2 + Math.floor(Math.random() * (GRID_SIZE - 4));
  foxY = 2 + Math.floor(Math.random() * (GRID_SIZE - 4));

  // Player starts at a random edge
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: playerX = 0; playerY = Math.floor(Math.random() * GRID_SIZE); break;
    case 1: playerX = GRID_SIZE - 1; playerY = Math.floor(Math.random() * GRID_SIZE); break;
    case 2: playerX = Math.floor(Math.random() * GRID_SIZE); playerY = 0; break;
    case 3: playerX = Math.floor(Math.random() * GRID_SIZE); playerY = GRID_SIZE - 1; break;
  }
  prevPlayerX = playerX;
  prevPlayerY = playerY;

  stepCount = 0;
  huntActive = true;
  foxFoundFlag = false;

  updateHuntUI();
  drawField();
  setStatus(true);
  log(LANG[currentLang].huntStarted, 'success');
  playSound('click');
}

function movePlayer(dx, dy) {
  if (!huntActive || foxFoundFlag) return;

  const nx = playerX + dx;
  const ny = playerY + dy;
  if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;

  prevPlayerX = playerX;
  prevPlayerY = playerY;
  playerX = nx;
  playerY = ny;
  stepCount++;

  playSound('click');
  updateHuntUI();
  drawField();

  // Check if fox found
  const dist = getDistance();
  if (dist < FIND_THRESHOLD) {
    foxFound();
  }
}

function getDistance() {
  return Math.sqrt((playerX - foxX) ** 2 + (playerY - foxY) ** 2);
}

function getSignalStrength() {
  const dist = getDistance();
  if (dist < 0.5) return 1.0;
  // Inverse square law with noise
  const raw = 1.0 / (dist * dist);
  const noise = (Math.random() - 0.5) * NOISE_FACTOR * raw;
  return Math.min(1.0, Math.max(0.0, raw * 15 + noise));  // scaled and clamped
}

function getBearing() {
  const dx = foxX - playerX;
  const dy = foxY - playerY;
  let angle = Math.atan2(-dy, dx) * (180 / Math.PI);  // -dy because canvas Y is inverted
  if (angle < 0) angle += 360;
  return Math.round(angle);
}

function getDirectionArrowAngle() {
  // Arrow points from player toward fox based on signal gradient
  const dx = foxX - playerX;
  const dy = foxY - playerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Add some noise based on distance (far = more noise)
  const dist = getDistance();
  const noise = (Math.random() - 0.5) * Math.min(60, dist * 5);
  return angle + noise - 90; // -90 because arrow starts pointing up
}

function updateHuntUI() {
  const s = LANG[currentLang];
  const signal = getSignalStrength();
  const dist = getDistance();
  const bearing = getBearing();

  // Signal bar
  const bar = $('signalBar');
  if (bar) {
    const pct = Math.round(signal * 100);
    bar.style.width = pct + '%';
    // Hot/cold color
    if (signal > 0.7) bar.style.background = '#ff3333';
    else if (signal > 0.4) bar.style.background = '#ff9933';
    else if (signal > 0.15) bar.style.background = '#33cc33';
    else bar.style.background = '#3399ff';
  }

  // Direction arrow
  const arrow = $('dirArrow');
  if (arrow) {
    const angle = getDirectionArrowAngle();
    arrow.style.transform = `rotate(${angle}deg)`;
  }

  // Distance estimate (qualitative)
  const distEl = $('distEstimate');
  if (distEl) {
    if (dist > 12) distEl.textContent = s.distFar || 'Far';
    else if (dist > 7) distEl.textContent = s.distMedium || 'Medium';
    else if (dist > 3) distEl.textContent = s.distClose || 'Close';
    else distEl.textContent = s.distVeryClose || 'Very Close';
  }

  // Steps
  const stepEl = $('stepCount');
  if (stepEl) stepEl.textContent = stepCount;

  // Bearing
  const bearEl = $('bearingDisplay');
  if (bearEl) bearEl.textContent = bearing + '\u00B0';
}

function foxFound() {
  foxFoundFlag = true;
  huntActive = false;
  const s = LANG[currentLang];
  const msg = (s.foxFound || 'Fox found in {n} steps!').replace('{n}', stepCount);

  log(msg, 'success');
  playSound('success');
  setPetState('happy');
  showToast(msg, 3000);

  // Show fox on canvas
  drawField(true);

  // Overlay animation
  const wrap = $('canvasWrap');
  if (wrap) {
    const overlay = document.createElement('div');
    overlay.className = 'fox-found-overlay';
    overlay.textContent = '🦊 ' + stepCount + ' steps';
    wrap.appendChild(overlay);
    setTimeout(() => overlay.style.opacity = '0.8', 2000);
  }
}

function drawField(showFox) {
  if (!fieldCanvas || !fieldCtx) return;
  const ctx = fieldCtx;
  const w = fieldCanvas.width;
  const h = fieldCanvas.height;
  const cellW = w / GRID_SIZE;
  const cellH = h / GRID_SIZE;

  // Background
  ctx.fillStyle = '#0a1a0a';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(100, 200, 100, 0.15)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellW, 0);
    ctx.lineTo(i * cellW, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellH);
    ctx.lineTo(w, i * cellH);
    ctx.stroke();
  }

  // Signal heatmap (faint circles from fox)
  if (huntActive || showFox) {
    const dist = getDistance();
    const signal = getSignalStrength();

    // Draw signal rings (only visible when close)
    if (signal > 0.1) {
      const ringCount = 3;
      for (let r = 1; r <= ringCount; r++) {
        const radius = r * 3 * cellW;
        ctx.beginPath();
        ctx.arc(foxX * cellW + cellW / 2, foxY * cellH + cellH / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 100, 50, ${0.05 * signal * (ringCount - r + 1)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  // Trail (previous position)
  if (huntActive && stepCount > 0) {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(prevPlayerX * cellW + cellW / 2, prevPlayerY * cellH + cellH / 2, cellW * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player position
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4af37';
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(playerX * cellW + cellW / 2, playerY * cellH + cellH / 2, cellW * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Player label
  ctx.fillStyle = '#000';
  ctx.font = `bold ${Math.round(cellW * 0.5)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', playerX * cellW + cellW / 2, playerY * cellH + cellH / 2);

  // Fox (only show if found)
  if (showFox || foxFoundFlag) {
    ctx.font = `${Math.round(cellW * 0.9)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦊', foxX * cellW + cellW / 2, foxY * cellH + cellH / 2);
  }

  // Compass rose
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N', w / 2, 12);
  ctx.fillText('S', w / 2, h - 4);
  ctx.textAlign = 'left';
  ctx.fillText('W', 4, h / 2);
  ctx.textAlign = 'right';
  ctx.fillText('E', w - 4, h / 2);
}

/* ═══════ INIT ═══════ */

function init() {
  // Splash
  initSplash();

  // Inject logo
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help panel (left)
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings panel (right)
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  // Log panel (right, docked)
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound toggle
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  // Whisper mode
  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  // Breathing guide + dhikr
  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  // Music mode
  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Escape key + focus trap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  // Language dropdown
  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));

  // Theme dropdown
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore saved preferences
  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  // Version check
  checkVersion();

  // App messaging listener
  onAppMessage(msg => {
    log(`📨 ${msg.from}: ${msg.type}`, 'rx');
  });

  // Geeky features
  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();

  // Magic features
  initGhostUsers();
  initPixelPet();
  initNightMode();
  initLogoTracker();
  initAR();
  initAIChat();

  // Fox Hunt Simulation
  initFoxHunt();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#settingsCloseBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#whisperBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#breathingBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
